package mike.demo;

import java.math.*;
import java.util.*;
import javax.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;


@RestController
@EnableTransactionManagement
public class RestService {
    
    static final String DEFAULT_IMPORT_URL = "https://data.lacity.org/api/views/nxs9-385f/rows.csv?accessType=DOWNLOAD";
    
    @Autowired
    ZipCodeStatsRepo zipCodeStatsRepo;
    
    @Autowired
    private EntityManagerFactory entityManagerFactory;
    
    private EntityManager entityManager = null;
    
    
    @GetMapping("/zipCodeStats/{zipCode}")
    public ResponseEntity zipCodeStatsGet(@PathVariable String zipCode) {
        try {
            Optional<ZipCodeStats> found = zipCodeStatsRepo.findById(zipCode);
            if (found.isPresent())
                return new ResponseEntity(found.get(), HttpStatus.OK);
            else
                return new ResponseEntity(HttpStatus.NOT_FOUND);

        } catch (Throwable t) {
            return getErrorResponse(t);
        }
    }


    @RequestMapping(value="/zipCodeStats/{zipCode}", method=RequestMethod.HEAD) // probably useless, but standard requires it
    public ResponseEntity zipCodeStatsHead(@PathVariable String zipCode) {
        try {
            return new ResponseEntity( zipCodeStatsRepo.existsById(zipCode) ? HttpStatus.OK : HttpStatus.NOT_FOUND);

        } catch (Throwable t) {
            return getErrorResponse(t);
        }
    }


    @PutMapping(path="/zipCodeStats/{zipCode}", consumes="application/json")
    public ResponseEntity zipCodeStatsPut(@PathVariable String zipCode,
            @RequestHeader(value="Content-Range", required=false) String contentRange,
            @RequestBody ZipCodeStats zipCodeStats) {

        try {
            if ( ! Objects.equals(zipCode, zipCodeStats.getZip_code()))
                return new ResponseEntity("Resource path does not match entity ID (ZIP code)", HttpStatus.BAD_REQUEST);

            if ((contentRange != null) && ! contentRange.trim().isEmpty()) // check required by RFC 7231
                return new ResponseEntity("Content-Range not supported for PUT", HttpStatus.BAD_REQUEST);

            boolean preExisting = zipCodeStatsRepo.existsById(zipCode);
            zipCodeStatsRepo.save(zipCodeStats);
            return new ResponseEntity( preExisting ? HttpStatus.OK : HttpStatus.CREATED);

        } catch (Throwable t) {
            return getErrorResponse(t);
        }
    }


    // per RFC 5789, PATCH support is not required, and I think it would add unnecessary complexity in this case


    @DeleteMapping("/zipCodeStats/{zipCode}")
    public ResponseEntity zipCodeStatsDelete(@PathVariable String zipCode) {
        try {
            zipCodeStatsRepo.deleteById(zipCode);
            return new ResponseEntity(HttpStatus.OK);

        } catch (Throwable t) {
            return getErrorResponse(t);
        }
    }


    @PostMapping(path="/zipCodeStats", consumes="application/json")
    public synchronized ResponseEntity zipCodeStatsPost(@RequestBody HashMap<String,Object> parms) {

        String csvURL = (String) parms.get("csvURL");
        if ((csvURL == null) || csvURL.trim().isEmpty())
            csvURL = DEFAULT_IMPORT_URL;

        int lineNum = 0; // is way up here so it can be reported in exceptions
        EntityTransaction dbTrn = null; // rather than @Transactional, for rollback capability for non-exception errors
        try {
            dbTrn = getEntityManager().getTransaction();
            dbTrn.begin(); // save all or nothing 

            String csv = (new RestTemplate()).getForObject(csvURL, String.class);

            /* CSVReader is not used because my IntelliJ refused to import any of the available opencsv artifacts.
                 Better to write it myself than risk a broken build from an unreliable 3rd party dependency. */

            Scanner csvScan = new Scanner(csv);
            boolean inBody = false;
            int uploadCount = 0;
            while (csvScan.hasNextLine()) {
                ++lineNum;
                String line = csvScan.nextLine().trim();
                if (line.isEmpty())
                    continue;

                String fields[] = line.split(",");
                if (fields.length != 7) {
                    return new ResponseEntity("Incorrect number of fields in line "+lineNum, HttpStatus.BAD_REQUEST);
                }

                // skip heading (only permitted once, before data encountered)
                if (fields[0].trim().isEmpty()) {
                    return new ResponseEntity("Missing start of line "+lineNum, HttpStatus.BAD_REQUEST);
                } else if ( ! Character.isDigit(fields[0].trim().charAt(0))) { // looks like heading
                    if ( ! inBody) { // no previous heading or data encountered
                        inBody = true;
                        continue;
                    }
                }
                inBody = true;

                // validate ZIP code, which is the primary key
                String zipCode = fields[0].replaceAll("\\s+", ""); // remove all whitespace; we can be a little fault-tolerant if the input is intelligible
                String zipParts[] = zipCode.split("-");
                if ((zipParts.length > 2) || (zipParts[0].length() != 5) || ((zipParts.length > 1) && (zipParts[1].length() != 4))) {
                    return new ResponseEntity("Invalid ZIP code in line "+lineNum, HttpStatus.BAD_REQUEST);
                }
                try {
                    Integer.parseInt(zipParts[0]);
                    if (zipParts.length > 1) {
                        Integer.parseInt(zipParts[1]);
                    }
                } catch (NumberFormatException e) {
                    return new ResponseEntity("Invalid ZIP code in line "+lineNum, HttpStatus.BAD_REQUEST);
                }

                ZipCodeStats zcs = new ZipCodeStats(zipCode);
                zcs.setTotal_population(Integer.parseInt(fields[1]));
                zcs.setMedian_age(new BigDecimal(fields[2]));
                zcs.setTotal_males(Integer.parseInt(fields[3]));
                zcs.setTotal_females(Integer.parseInt(fields[4]));
                zcs.setTotal_households(Integer.parseInt(fields[5]));
                zcs.setAverage_household_size(new BigDecimal(fields[6]));
                zipCodeStatsRepo.save(zcs);
                ++uploadCount;
            }

            dbTrn.commit();
            
            HashMap<String,Object> responseMap = new HashMap();
            responseMap.put("uploadCount", uploadCount);
            return new ResponseEntity(responseMap, HttpStatus.OK);

        } catch (NumberFormatException e) {
            return new ResponseEntity("Non-number found where number expected in line "+lineNum, HttpStatus.BAD_REQUEST);
        } catch (Throwable t) {
            return getErrorResponse(t);

        } finally {
            if ((dbTrn != null) && dbTrn.isActive())  // was not committed; some error occurred
                dbTrn.rollback();
        }
    }


    @GetMapping("/getZipCodesByStatisticRange")
    public ResponseEntity getZipCodesByStatisticRange(
            @RequestParam String statisticName, // total_population or median_age
            @RequestParam BigDecimal min, @RequestParam BigDecimal max) {

        try {
            statisticName = escapeForSQL(statisticName);
            
            Query query = getEntityManager().createNativeQuery("select zip_code from zip_code_stats"
                    +" where "+statisticName+" >= "+min+" and "+statisticName+" <= "+max
                    +" order by zip_code");

            List<String> data = query.getResultList();
            return new ResponseEntity(data, HttpStatus.OK);
            
        } catch (Throwable t) {
            return getErrorResponse(t);
        }
    }


    @GetMapping("/getZipCodesByMostPopulated")
    public ResponseEntity getZipCodesByMostPopulated( @RequestParam Integer qtyLimit) {
        try {
            List<String> data = zipCodeStatsRepo.findByMostPopulated(qtyLimit);
            return new ResponseEntity(data, HttpStatus.OK);
            
        } catch (Throwable t) {
            return getErrorResponse(t);
        }
    }


    @GetMapping("/getZipCodesByFemaleMajority")
    public ResponseEntity getZipCodesByFemaleMajority() {
        try {
            List<String> data = zipCodeStatsRepo.findByFemaleMajority();
            return new ResponseEntity(data, HttpStatus.OK);
            
        } catch (Throwable t) {
            return getErrorResponse(t);
        }
    }

    
    private ResponseEntity getErrorResponse(Throwable t) {
        String errmsg = t.getMessage();
        while (t.getCause() != null) {
            t = t.getCause();
            errmsg += " : "+t.getMessage();
        }
        return new ResponseEntity(errmsg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    
    private synchronized EntityManager getEntityManager() {
        if (entityManager == null)
            entityManager = entityManagerFactory.createEntityManager();
        
        return entityManager;
    }
    
    
    private String escapeForSQL(String s) { // protect against SQL injection 
        return s.replace("\\","\\\\").replace("\"", "\\\"").replace("'","\\'");
    }


}
