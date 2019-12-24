package mike.demo;


import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.*;


@Entity
@Table( indexes = { // primary key (zip_code) is implicitly uniquely indexed
        @Index(name="totalPopulationIdx", columnList="total_population"),
        @Index(name="medianAgeIdx", columnList="median_age"),
        @Index(name="femaleMajorityIdx", columnList="total_males,total_females")
})
public class ZipCodeStats implements Serializable {

    @Id
    private String zip_code;

    private Integer total_population, total_males, total_females, total_households;
    private BigDecimal median_age, average_household_size;


    public ZipCodeStats() {
        super();
    }

    public ZipCodeStats(String zipCode) {
        this.zip_code = zipCode;
    }


    public String getZip_code() {
        return zip_code;
    }


    public Integer getTotal_population() {
        return total_population;
    }


    public void setTotal_population(Integer total_population) {
        this.total_population = total_population;
    }


    public BigDecimal getMedian_age() {
        return median_age;
    }


    public void setMedian_age(BigDecimal median_age) {
        this.median_age = median_age;
    }


    public Integer getTotal_males() {
        return total_males;
    }


    public void setTotal_males(Integer total_males) {
        this.total_males = total_males;
    }


    public Integer getTotal_females() {
        return total_females;
    }


    public void setTotal_females(Integer total_females) {
        this.total_females = total_females;
    }


    public Integer getTotal_households() {
        return total_households;
    }


    public void setTotal_households(Integer total_households) {
        this.total_households = total_households;
    }


    public BigDecimal getAverage_household_size() {
        return average_household_size;
    }


    public void setAverage_household_size(BigDecimal average_household_size) {
        this.average_household_size = average_household_size;
    }


}
