MikeDemo is a Spring Boot Maven project with a React front end.

For this project, React and Babel are included as js to keep the build process simple.
All that should be necessary is pull the repo down and do a Maven build.

The project looks for a MySQL compatible database at localhost port 3306, and expects
a pre-existing database named "test" with username "user" and password "user".

REST service was tested in IntelliJ and Netbeans, running it via the debug target.
The URL for the interface should then be localhost:8080/demo.

The REST service has the following paths:

    /demo/zipCodeStats    (POST w/ JSON value "csvURL" set to URL of CSV file,
                            or leave that value empty to use the default URL.
                            Adds and/or updates multiple resources from CSV,
                            either applying all upon total success, or aborting
                            all changes if any kind of significant error occurs.)
                            
    /demo/zipCodeStats/{zipCode}    (GET statistics for a ZIP code as JSON,
                                          i.e. /demo/zipCodeStats/29407)

    /demo/zipCodeStats/{zipCode}    (PUT stats for a ZIP code; see entity below)
    
    /demo/getZipCodesByStatisticRange   (GET w/ parameters as JSON: min, max, and
                                          statisticName :  total_population  or  median_age)
                                          
    /demo/getZipCodesByMostPopulated    (GET w/ JSON parameter qtyLimit)
    
    /demo/getZipCodesByFemaleMajority   (simple GET w/ no parameters)
    
    
    ZipCodeStats data entity (JSON format for resource reading & writing):
        {
          "zip_code":  NNNNN  or  NNNNN-NNNN,  as string
          "total_population":  integer,
          "median_age":  decimal,
          "total_males":  integer,
          "total_females":  integer,
          "total_households":  integer,
          "average_household_size":  decimal
        }
        
        
Naming conventions:
    Everything is camel case except for persisted data fields, which use underscores
          both in the data table and JSON entities.
