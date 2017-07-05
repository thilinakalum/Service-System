/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mac.care_point.service.job_card.model;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 *
 * @author HP
 */
@Entity
@Table(name = "jobsum")
public class JobSummary implements Serializable {

    @Id
    @Column(name = "jobno")
    private String jobNo;

    @Column(name = "jobdate")
    @Temporal(TemporalType.TIMESTAMP)
    private Date jobDate;

    @Column(name = "vehno")
    private String vehicleNo;
    
    @Column(name = "intime")
    private String inTime;

    @Column(name = "type")
    private String type;

    @Column(name = "vmake")
    private String make;

    @Column(name = "inm")
    private String inMillage;
    
    @Column(name = "nsm")
    private String nsm;
    
    @Column(name = "jobc")
    private String jobC;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cusno")
    private Customer customer;

    public JobSummary() {
    }

    public String getJobNo() {
        return jobNo;
    }

    public void setJobNo(String jobNo) {
        this.jobNo = jobNo;
    }

    public Date getJobDate() {
        return jobDate;
    }

    public void setJobDate(Date jobDate) {
        this.jobDate = jobDate;
    }

    public String getVehicleNo() {
        return vehicleNo;
    }

    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getInMillage() {
        return inMillage;
    }

    public void setInMillage(String inMillage) {
        this.inMillage = inMillage;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public String getInTime() {
        return inTime;
    }

    public void setInTime(String inTime) {
        this.inTime = inTime;
    }

    public String getNsm() {
        return nsm;
    }

    public void setNsm(String nsm) {
        this.nsm = nsm;
    }

    public String getJobC() {
        return jobC;
    }

    public void setJobC(String jobC) {
        this.jobC = jobC;
    }

}
