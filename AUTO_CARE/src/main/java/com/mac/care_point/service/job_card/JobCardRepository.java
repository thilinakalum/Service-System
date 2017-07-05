/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mac.care_point.service.job_card;

import com.mac.care_point.service.job_card.model.JobSummary;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author HP
 */
public interface JobCardRepository extends JpaRepository<JobSummary, Integer> {

    @Query("select job from JobSummary job where job.jobNo in (select max(cast(jobx.jobNo as int)) from JobSummary jobx where jobx.vehicleNo like %:vehicleNo1% or jobx.vehicleNo like %:vehicleNo2% or jobx.vehicleNo like %:vehicleNo3% group by jobx.vehicleNo)")
    public List<JobSummary> findByVehicleNoLike(
            @Param("vehicleNo1") String vehicleNo1,
            @Param("vehicleNo2") String vehicleNo2,
            @Param("vehicleNo3") String vehicleNo3,
            Pageable pageable);

    default List<JobSummary> findByVehicleNoLikeLimit10(String vehicleNo1, String vehicleNo2, String vehicleNo3) {
        return findByVehicleNoLike(vehicleNo1, vehicleNo2, vehicleNo3, new PageRequest(0, 10));
    }

    @Query("select max(cast(job.jobNo as int)) from JobSummary job")
    public Integer maxJobCardNo();
}
