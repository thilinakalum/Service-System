(function () {
    angular.module("AppModule")
            .controller("JobCardController", function ($scope, $timeout, $filter, JobCardModel, Notification, ConfirmPane, SystemConfig) {
                $scope.imagemodelX = [];
                $scope.ui = {};
                $scope.ui.mode = "VEHICLE";//or IMAGE
                $scope.ui.imageShowMode1 = 'NotAvalable';//or IMAGE VIEW
                $scope.ui.imageShowMode2 = 'NotAvalable';//or IMAGE VIEW
                $scope.ui.imageShowMode3 = 'NotAvalable';//or IMAGE VIEW
                $scope.ui.imageShowMode4 = 'NotAvalable';//or IMAGE VIEW

                $scope.ui.imageModel = [];
                $scope.imagemodel = [],
                $scope.model = new JobCardModel();

                $scope.ui.toggleMode = function () {
                    if ($scope.ui.mode === 'VEHICLE') {
                        $scope.ui.mode = 'ITEM';
                    } else {
                        $scope.ui.mode = 'VEHICLE';
                    }
                };

                $scope.ui.newCustomer = function () {
                    $scope.model.jobCard.customer = {};
                };
                $scope.ui.focus = function (id) {
                    $timeout(function () {
                        document.querySelectorAll(id)[0].focus();
                    }, 10);
                };

                $scope.ui.setNewJobCard = function () {
                    $scope.ui.focus('#vehicleText');
                    var vehNo = $scope.model.searchKeyword;
                    $scope.model.newJobCard();

                    $scope.model.jobCard.vehicleNo = vehNo;

                };

                //NIC Get Month and Date
                $scope.model.getMonthAndDate = function (gender, birthYear, birthDays) {
                    if (birthDays >= 1 && birthDays <= 360) {
                        var birthMonth;
                        var birthDay;

                        if (birthDays < 32) {
                            birthMonth = 1;
                            birthDay = birthDays;
                        } else if (birthDays > 31 && birthDays < 61) {
                            birthMonth = 2;
                            birthDay = birthDays - 31;
                        } else if (birthDays > 60 && birthDays < 92) {
                            birthMonth = 3;
                            birthDay = birthDays - 60;
                        } else if (birthDays > 91 && birthDays < 122) {
                            birthMonth = 4;
                            birthDay = birthDays - 91;
                        } else if (birthDays > 121 && birthDays < 153) {
                            birthMonth = 5;
                            birthDay = birthDays - 121;
                        } else if (birthDays > 152 && birthDays < 183) {
                            birthMonth = 6;
                            birthDay = birthDays - 152;
                        } else if (birthDays > 182 && birthDays < 214) {
                            birthMonth = 7;
                            birthDay = birthDays - 182;
                        } else if (birthDays > 213 && birthDays < 245) {
                            birthMonth = 8;
                            birthDay = birthDays - 213;
                        } else if (birthDays > 244 && birthDays < 275) {
                            birthMonth = 9;
                            birthDay = birthDays - 244;
                        } else if (birthDays > 274 && birthDays < 306) {
                            birthMonth = 10;
                            birthDay = birthDays - 274;
                        } else if (birthDays > 305 && birthDays < 336) {
                            birthMonth = 11;
                            birthDay = birthDays - 305;
                        } else if (birthDays > 335 && birthDays < 367) {
                            birthMonth = 12;
                            birthDay = birthDays - 335;
                        }
                        //set customer bday
                        $scope.model.jobCard.customer.birthDate = birthYear + "-" + birthMonth + "-" + birthDay;

//                      var birthDate = "Gender : " + gender + " birthYear : " + birthYear + " birthMonth : " + birthMonth + " birthDay : " + birthDay;
                    } else {
                        console.log("3rd number to 5th nois wrong");
                    }
                };


                // NIC validation And get birth day
                $scope.ui.nicValidation = function () {
                    var nicNo = $scope.model.jobCard.customer.nic;
                    if (nicNo.length === 12) {
                        var birthYear = nicNo.substring(4, 0);
                        var idNo = nicNo.substring(12, 4);

                        var birthDays = idNo.substring(3, 0);
                        if (birthDays <= 500) {
                            var gender = "MALE";
                            $scope.model.getMonthAndDate(gender, birthYear, birthDays);
                        } else {
                            var newDays = birthDays - 500;
                            var gender = "FEMALE";
                            $scope.model.getMonthAndDate(gender, birthYear, newDays);
                        }
                    } else {
                        if (nicNo.length === 10) {
                            var birthYear = "19" + nicNo.substring(2, 0);
                            var idNo = nicNo.substring(10, 2);

                            var birthDays = idNo.substring(3, 0);
                            if (birthDays <= 500) {
                                var gender = "MALE";
                                $scope.model.getMonthAndDate(gender, birthYear, birthDays);
                            } else {
                                var newDays = birthDays - 500;
                                var gender = "FEMALE";
                                $scope.model.getMonthAndDate(gender, birthYear, newDays);
                            }
                        } else {
                            console.log("wrong id no");
                        }
                    }
                };

                // saveJobCard
                $scope.ui.saveJobCard = function () {
                    $scope.ui.nicValidation();
                    $scope.model.saveJobCard()
                            .then(function () {
                                Notification.success("Save job-card success !!!");
                                $scope.ui.toggleMode();
                            }, function () {
                                Notification.error("Save job-card fail !!!");
                            });

                };

                $scope.ui.setExistingJobCard = function (jobCard) {

                    var data = parseInt(jobCard.inMillage);
                    jobCard.inMillage = data;

                    if (jobCard.jobC === "N") {
                        ConfirmPane.warningConfirm("Pending Job Card Avalable for this Vehicle !!! Do you want Edit this job ")
                                .confirm(function () {
                                    $scope.model.setJobCard(jobCard);

                                    $scope.model.jobCard.jobDate = $filter('date')(jobCard.jobDate, 'yyyy-MM-dd');
                                    console.log($scope.model.jobCard.jobDate);

                                    //image load
                                    $scope.model.downloardImage(jobCard.jobNo)
                                            .then(function (data) {
                                                for (var i = 0; i < data.length; i++) {
                                                    $scope.imagemodelX[i] = SystemConfig.apiUrl + "/api/care-point/transaction/job-card/download-image/" + data[i];
                                                    console.log($scope.imagemodelX[i]);
                                                    $scope.ui.imageShowMode1 = 'Avalable';
                                                    $scope.ui.imageShowMode2 = 'Avalable';
                                                    $scope.ui.imageShowMode3 = 'Avalable';
                                                    $scope.ui.imageShowMode4 = 'Avalable';
                                                }
                                            }, function () {

                                            });
                                })
                                .discard(function () {
                                    ConfirmPane.warningConfirm("Do u want to create another job card ..???")
                                            .confirm(function () {
                                                jobCard.jobC = "Y";
                                                $scope.model.setJobCard(jobCard);
                                            })
                                            .discard(function () {

                                            });
                                });
                    } else {
                        $scope.model.setJobCard(jobCard);
                        $scope.model.jobCard.jobDate = $filter('date')(jobCard.jobDate, 'yyyy-MM-dd');
                        console.log($scope.model.jobCard.jobDate);
                    }
                };

                $scope.ui.vehicleTextChange = function (e) {
                    if (e.keyCode === 32) {
                        $scope.$apply(function () {

                            var newV = $scope.model.jobCard.vehicleNo;
                            $scope.model.jobCard.vehicleNo = newV + "-";
                        });
                    }
                };

                $scope.ui.categoryDatail = function () {
                    $scope.model.saveCategoryDatail()
                            .then(function () {
                                console.log("success");
                            }, function () {
                                console.log("fail");
                            });
                };

                $scope.ui.uploadForm = function () {
                    ConfirmPane.successConfirm("Do you want to Save Images ?")
                            .confirm(function () {
                                var jobNo = $scope.model.jobCard.jobNo;
                                for (var i = 0; i < $scope.imagemodel.length; i++) {
                                    var url = SystemConfig.apiUrl + "/api/care-point/transaction/job-card/upload-image/" + jobNo + "/" + i;
                                    var formData = new FormData();
                                    formData.append("file", $scope.imagemodel[i]);

                                    var xhr = new XMLHttpRequest();
                                    xhr.open("POST", url);
                                    xhr.send(formData);
                                }
                                $scope.ui.finish();

                            })
                            .discard(function () {
                                ConfirmPane.dangerConfirm("Do you want to Delete All Images ?")
                                        .confirm(function () {
                                            $scope.imagemodelX = [];
                                            $scope.ui.imageShowMode1 = 'NotAvalable';//or IMAGE VIEW
                                            $scope.ui.imageShowMode2 = 'NotAvalable';//or IMAGE VIEW
                                            $scope.ui.imageShowMode3 = 'NotAvalable';//or IMAGE VIEW
                                            $scope.ui.imageShowMode4 = 'NotAvalable';//or IMAGE VIEW
                                            $scope.ui.setJobWork();
                                        })
                                        .discard(function () {
                                            $scope.ui.setJobWork();
                                        });
                            });
                };

                $scope.ui.showImg = function () {
                    if ($scope.imagemodel.length === 0) {
                        $scope.ui.showImg === 2;
                    }
                };


                $scope.ui.changeFunction = function (event) {
                    if ($scope.ui.imageShowMode1 === 'NotAvalable') {
                        $scope.ui.imageShowMode1 = 'Avalable';
                    } else if ($scope.ui.imageShowMode2 === 'NotAvalable') {
                        $scope.ui.imageShowMode2 = 'Avalable';
                    } else if ($scope.ui.imageShowMode3 === 'NotAvalable') {
                        $scope.ui.imageShowMode3 = 'Avalable';
                    } else if ($scope.ui.imageShowMode4 === 'NotAvalable') {
                        $scope.ui.imageShowMode4 = 'Avalable';
                    }
                    var files = event.target.files;
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        $scope.imagemodel.push(file);

                        var reader = new FileReader();
                        reader.onload = $scope.imageIsLoaded;
                        reader.readAsDataURL(file);
                    }
                };

                $scope.imageIsLoaded = function (e) {
                    $scope.$apply(function () {
                        $scope.imagemodelX.push(e.target.result);
                    });
                };


                $scope.ui.showImg = function () {
                    if ($scope.imageModel) {
                        $scope.ui.showImg;
                    }
                };

                $scope.ui.setNextMillage = function () {
                    var inMilage = parseInt($scope.model.jobCard.inMillage);
                    $scope.model.jobCard.nextMillage = parseInt(inMilage + 5000);
                };
                $scope.ui.setImageDiv = function () {
                    $scope.ui.mode = "IMAGE";
                },
                        $scope.ui.finish = function () {
                            Notification.success("Success");
                            $scope.ui.viewDiv = 'CLIENT';
                            $scope.ui.mode = "VEHICLE";//or IMAGE or ITEM
                            $scope.model.jobCard = {};
                            $scope.model.categoryDetail = {};
                            $scope.model.jobCard = {};
                            $scope.model.searchKeyword = null;
                        };

                $scope.ui.init = function () {
                    
//                   var userLoginCookiess = $cookies.get('userLoginCookies');
                   
//                    console.log(userLoginCookiess);
                    $scope.ui.focus('#search_veh');
                    $scope.$watch('model.searchKeyword', function (newV, oldV) {
                        $scope.model.showSuggestions = newV && newV.length;

                        if (newV && newV.length >= 2) {
                            //load from server
                            $scope.model.findByVehicleNumber();
                        }
                    });

                    $scope.$watch('model.jobCard', function (newVal) {
                        if (newVal) {
                            $scope.model.showSuggestions = !$scope.model.jobCard;
                        }
                    });


//                    $scope.$watch('model.jobCard.vehicleNo', function (newV) {
//                        console.log(newV);
//                        $scope.model.jobCard.vehicleNo = newV ? newV.split(" ").join("-") : newV;
//                        console.log($scope.model.jobCard.vehicleNo);
//                        $scope.$digest();
//                    });


                };
                $scope.ui.init();
            });
}());