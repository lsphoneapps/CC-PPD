
package mike.demo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface ZipCodeStatsRepo extends JpaRepository<ZipCodeStats,String> {
    
    
    @Query(value="select zip_code from zip_code_stats"
            +" order by total_population DESC"
            +" limit :qtyLimit",
            nativeQuery=true)
    List<String> findByMostPopulated(@Param("qtyLimit") int qtyLimit);
    
    
    @Query(value="select zip_code from zip_code_stats"
            +" where total_females > total_males"
            +" order by (total_females - total_males) DESC",
            nativeQuery=true)
    List<String> findByFemaleMajority();
    
    
}
