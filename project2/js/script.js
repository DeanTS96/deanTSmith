let employeeIDToDelete;
let departmentIDToDelete;
let locationIDToDelete;

let employeeIDToUpdate;
let departmentIDToUpdate;
let locationIDToUpdate;

let employeeToClose;
let departmentToClose;

let getAllFunction;

$(window).load(function() {
    $('.preloader').fadeOut('slow');
 });

let capitalize = function(string) {
    string = string.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
    return string;
};

const getAll = function() {
    $.ajax({
        url: "php/getAll.php",
        type: "POST",
        dataType: "json",

        success: function(result) {
            getAllFunction = function(result) {
            $('#employeeTableBody').empty();

            let sortedEmployees = result.data.sort(function(a, b) {
                if(a.lastName < b.lastName) {
                    return -1;
                }
                if(a.lastName > b.lastName) {
                    return 1;
                }
                return 0;
            });

            let employeeCounter = 0;

            sortedEmployees.forEach(employee => {
                employeeCounter += 1;
                let employeeId = "employee" + employeeCounter;
                let databaseEmployeeID = employee.id

                    let employeeBox = '<tr><td data-id=' + databaseEmployeeID + '><div class="card"><div class="card-header"><a class="slideTogglerEmployees slideToggler" href="#/"><h1 class="boxHeader">' + employee.lastName + ', ' + employee.firstName +
                     '</h1></a><button class="deleteEmployee btn btn-primary float-end updateDeleteButton headerUpdateDeleteButton ms-2 me-2 d-lg-block" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal">Delete</button><button class="updateEmployee btn btn-primary float-end updateDeleteButton headerUpdateDeleteButton d-lg-block" data-bs-toggle="modal" data-bs-target="#updateEmployeeFormModal">Edit</button></div></a><div id=' + 'e' + databaseEmployeeID + ' style="display: none" ><ul class="list-group list-group-horizontal-lg"><li class="col-lg-4 list-group-item"><i class="pe-2 fa-solid fa-envelope"></i>' + employee.email + 
                     '</li><li class=" col-lg-4 list-group-item"><i class="pe-2 fa-solid fa-briefcase"></i>' + employee.department + 
                     '</li><li class="col-lg-4 list-group-item"><i class="pe-2 ps-1 fa-solid fa-location-dot"></i>' + employee.location + 
                     '</li></ul><div class="card-footer d-flex flex-row-reverse"><button class="deleteEmployee btn btn-primary ms-1 updateDeleteButton d-lg-none" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal">Delete</button><button class="updateEmployee btn btn-primary updateDeleteButton d-lg-none" data-bs-toggle="modal" data-bs-target="#updateEmployeeFormModal">Edit</button></div></div></div></td></tr>';
                     
                $("#employeeTableBody").append(employeeBox);
            });
        

            $('.slideTogglerEmployees').click(function() {
                if($(employeeToClose).is(":visible")) {
                    $(employeeToClose).slideUp();
                }
                employeeToClose = '#e' + $(this).closest("td").attr("data-id");
                if(!$(employeeToClose).is(":visible")) {
                    $(employeeToClose).slideToggle("slow");
                }
            });

            $('.deleteEmployee').unbind();

            $(".deleteEmployee").bind('click', function(e) {
                var selectedEmployeeID = $(this).closest("td").attr("data-id");

                $.ajax({
                    url: 'php/getEmployee.php',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        id: selectedEmployeeID
                    },
                    success: function(result) {
                        const data = result.data[0];
                        const name = data.firstName + ' ' + data.lastName;
                        $('#deleteEmployeeName').html(name);
                        $('#deleteEmployeeEmail').html(data.email);
                        $('#deleteEmployeeDepartment').html(data.department);
                        employeeIDToDelete = data.id;
                    },
                    error: function(err) {
                        console.log("getEmployee error");
                    }
                });
            });

            $('.updateEmployee').unbind();

            $(".updateEmployee").bind("click", function(e) {
                    var selectedEmployeeID = $(this).closest("td").attr("data-id");

                    $.ajax({
                        url: 'php/getEmployee.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            id: selectedEmployeeID
                        },
                        success: function(result) {
                            const data = result.data[0];
                            $('#updateEmployeeFormFirstName').val(data.firstName);
                            $('#updateEmployeeFormLastName').val(data.lastName);
                            $('#updateEmployeeFormEmail').val(data.email);
                            $('#updateEmployeeFormDepartment').val(data.departmentID);
                            employeeIDToUpdate = data.id;
                        },
                        error: function(err) {
                            console.log("getEmployee error");
                        }
                    });
            });
        }
        getAllFunction(result);
        },
        error: function(err) {
            console.log(err, "errorPHP");
        }
    });
};
getAll();

const getDepartments = function () {
    $.ajax({
        url: "php/getAllDepartments.php",
        type: "POST",
        dataType: "json",

        success: function(result) {
                $("#departmentTableBody").empty();

                $('#searchFormDepartment').empty();
                $('#searchFormDepartment').append('<option style="display:none"></option>');
                $('#addFormDepartment').empty();
                $('#addFormDepartment').append('<option style="display:none"></option>');
                $('#updateEmployeeFormDepartment').empty();
                $('#updateEmployeeFormDepartment').append('<option style="display:none"></option>');

                let departmentArray = [];

                result.data.forEach(function(department) {
                    let name = department.name;

                    if(!departmentArray.includes(department.name)) {
                        departmentArray.push(department.name);

                        let departmentBox = '<tr><td data-id=' + department.id + '><div class="card"><div class="card-header"><a class="slideTogglerDepartments slideToggler" href="#/"><h1 class="boxHeader">' + department.name + 
                        '</h1></a><button class="deleteDepartment btn btn-primary ms-1 d-lg-block updateDeleteButton headerUpdateDeleteButton float-end">Delete</button><button class="updateDepartment btn btn-primary d-lg-block updateDeleteButton headerUpdateDeleteButton float-end" data-bs-toggle="modal" data-bs-target="#updateDepartmentFormModal">Edit</button></div><div id=' + 'd' +  department.id + 
                        ' style="display: none"><ul class="list-group list-group-flush"><li class="list-group-item"><i class="pe-2 ps-1 fa-solid fa-location-dot"></i>' + department.location + 
                        '</li></ul><div class="card-footer d-flex flex-row-reverse"><button class="deleteDepartment btn btn-primary ms-1 updateDeleteButton d-lg-none">Delete</button><button class="updateDepartment btn btn-primary updateDeleteButton d-lg-none" data-bs-toggle="modal" data-bs-target="#updateDepartmentFormModal">Edit</button></div></div></div></td></tr>';
                        $("#departmentTableBody").append(departmentBox);

                        $('#searchFormDepartment').append('<option value=' + department.id + '>' + name + '</option>');
                        $('#addFormDepartment').append('<option value=' + department.id + '>' + name + '</option>');
                        $('#updateEmployeeFormDepartment').append('<option value=' + department.id + '>' + name + '</option>');
                    };
                });

                $('.slideTogglerDepartments').click(function() {
                    if($(departmentToClose).is(":visible")) {
                        $(departmentToClose).slideUp();
                    }
                    departmentToClose = '#d' + $(this).closest("td").attr("data-id");
                    if(!$(departmentToClose).is(":visible")) {
                        $(departmentToClose).slideToggle("slow");
                    }
                });

                $('.deleteDepartment').unbind();

                $(".deleteDepartment").bind('click', function() {
                    var selectedDepartmentID = $(this).closest("td").attr("data-id");

                    $.ajax({
                        url: 'php/countEmployees.php',
                        type: 'GET',
                        data:{
                            id: selectedDepartmentID
                        },
                        success: function(result) {
                            if(result.data[0].numOfEmployees < 1) {
                                $.ajax({
                                    url: 'php/getDepartment.php',
                                    type: 'GET',
                                    dataType: 'json',
                                    data: {
                                        id: selectedDepartmentID
                                    },
                                    success: function(result) {
                                        const data = result.data[0];
                                        $('#deleteDepartmentName').html(data.name);
                                        departmentIDToDelete = data.id;
                                        $('#deleteDepartmentModal').modal("toggle");
                                    },
                                    error: function(err) {
                                        console.log("getDepartment error");
                                    }
                                });
                            } else {
                                $('#deleteDepartmentErrorModal').modal("toggle");
                            };
        
                        },
                        error: function(result) {
                            console.log("Delete department : count failed");
                        }
                    });
                });

                $('.updateDepartment').unbind();

                $(".updateDepartment").bind('click', function(e) {
                    var selectedDepartmentID = $(this).closest("td").attr("data-id");

                    $.ajax({
                        url: 'php/getDepartment.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            id: selectedDepartmentID
                        },
                        success: function(result) {
                            const data = result.data[0];
                            $('#updateDepartmentFormName').val(data.name);
                            $('#updateDepartmentFormLocation').val(data.locationID);
                            departmentIDToUpdate = data.id;
                        },
                        error: function(err) {
                            console.log("getLocation error");
                        }
                    });
                });
        },
        error: function(error) {
            console.log(error, "departments error");
        }
    });
};
getDepartments();

const getLocations = function() {
    $.ajax({
        url: "php/getAllLocations.php",
        type: "POST",
        dataType: "json",

        success: function(result) {
                $('#locationTableBody').empty();

                $('#searchFormLocation').empty();
                $('#searchFormLocation').append('<option style="display:none"></option>');
                $('#addNewDepartmentLocation').empty();
                $('#addNewDepartmentLocation').append('<option style="display:none"></option>');
                $('#updateEmployeeFormLocation').empty();
                $('#updateEmployeeFormLocation').append('<option style="display:none"></option>');
                $('#updateDepartmentFormLocation').empty();
                $('#updateDepartmentFormLocation').append('<option style="display:none"></option>');

                let locationArray = [];

                result.data.forEach(function(location) {

                    let name = location.name;

                    if(!locationArray.includes(location.name)) {
                        locationArray.push(location.name);

                        let locationBox = '<tr><td data-id=' + location.id + '><div class="card"><div class="card-header"><a class="slideTogglerLocations slideToggler" href="#/"><h1 class="boxHeader">' + location.name + 
                        '</h1></a><button class="deleteLocation btn btn-primary ms-1 d-lg-block updateDeleteButton headerUpdateDeleteButton float-end">Delete</button><button class="updateLocation btn btn-primary d-lg-block updateDeleteButton headerUpdateDeleteButton float-end" data-bs-toggle="modal" data-bs-target="#updateLocationFormModal">Edit</button></div><div id=' + 'l' +  location.id + 
                        ' style="display: none"><div class="card-footer d-flex flex-row-reverse"><button class="deleteLocation btn btn-primary ms-1 updateDeleteButton d-lg-none">Delete</button><button class="updateLocation btn btn-primary updateDeleteButton d-lg-none" data-bs-toggle="modal" data-bs-target="#updateLocationFormModal">Edit</button></div></div></div></td></tr>';

                        $("#locationTableBody").append(locationBox);

                        $('#searchFormLocation').append('<option value=' + location.id + '>' + name + '</option>');
                        $('#addNewDepartmentLocation').append('<option value=' + location.id + '>' + name + '</option>');
                        $('#updateDepartmentFormLocation').append('<option value=' + location.id + '>' + name + '</option>');
                    };
                });

                $('.slideTogglerLocations').click(function() {
                    if($(departmentToClose).is(":visible")) {
                        $(departmentToClose).slideUp();
                    }
                    departmentToClose = '#l' + $(this).closest("td").attr("data-id");
                    if(!$(departmentToClose).is(":visible")) {
                        $(departmentToClose).slideToggle("slow");
                    }
                });

                $('.deleteLocation').unbind();

                $(".deleteLocation").bind('click', function() {
                    var selectedLocationID = $(this).closest("td").attr("data-id");

                    $.ajax({
                        url: 'php/countDepartments.php',
                        type: 'GET',
                        data:{
                            id: selectedLocationID
                        },
                        success: function(result) {
                            if(result.data[0].numOfDepartments < 1) {
                                $.ajax({
                                    url: 'php/getLocation.php',
                                    type: 'GET',
                                    dataType: 'json',
                                    data: {
                                        id: selectedLocationID
                                    },
                                    success: function(result) {
                                        const data = result.data[0];
                                        $('#deleteLocationName').html(data.name);
                                        locationIDToDelete = data.id;
                                        $('#deleteLocationModal').modal("toggle");
                                    },
                                    error: function(err) {
                                        console.log("countDepartments error");
                                    }
                                });
                            } else {
                                $('#deleteLocationErrorModal').modal("toggle");
                            };
                        }, 
                        error: function(result) {
                            console.log('Delete location : count failed');
                        }
                    });
                });

                $('.updateLocation').unbind();

                $(".updateLocation").bind('click', function(e) {
                    var selectedLocationID = $(this).closest("td").attr("data-id");

                    $.ajax({
                        url: 'php/getLocation.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            id: selectedLocationID
                        },
                        success: function(result) {
                            const data = result.data[0];
                            $('#updateLocationFormName').val(data.name);
                            locationIDToUpdate = data.id;
                        },
                        error: function(err) {
                            console.log("getLocation error");
                        }
                    });
                });
                
        },
        error: function(err) {
            console.log(err, "locations error");
        }
    });
};
getLocations();

        $('#nameSearch').keyup(function(event) {
            if (event.keyCode === 13) {
                $('#nameSearchButton').click();
            };
        });

        $('#nameSearchButton').click(function() {
            $('#nameSearch').submit();
        });

        $('#addEmployeeModal').on('shown.bs.modal', function () {
            $('#addFormFirstName').focus();
          });

          $('#addDepartmentModal').on('shown.bs.modal', function () {
            $('#addNewDepartment').focus();
          });

          $('#addLocationModal').on('shown.bs.modal', function () {
            $('#addNewLocation').focus();
          });

          $('#advancedSearchModal').on('shown.bs.modal', function () {
            $('#searchFormFirstName').focus();
          });

        $("#mainPage").click(function() {
            $('#employeeChoice').attr('data-bs-target', '#addEmployeeModal');
            $('.spacer').height('150px');
            $("#newContent").show();
            $("#inputGroup").show();
            $('#logo').css("padding-bottom", "48px");
            $("#blankDepartment").hide();
            $("#blankLocation").hide();
        });

        $("#departmentChoice").click(function() {
            $('#employeeChoice').attr('data-bs-target', '#addDepartmentModal');
            $('.spacer').height('100px');
            $("#newContent").hide();
            $("#blankLocation").hide();
            $("#blankDepartment").show();
            $("#inputGroup").hide();
            $('#logo').css("padding-bottom", "0px");
        });

        $("#locationChoice").click(function() {
            $('#employeeChoice').attr('data-bs-target', '#addLocationModal');
            $('.spacer').height('100px');
            $("#newContent").hide();
            $("#inputGroup").hide();
            $('#logo').css("padding-bottom", "0px");
            $("#blankDepartment").hide();
            $("#blankLocation").show();
        });

            $("#addConfirm").click(function() {
                $('#myModal').modal('show');
                const firstName = $("#addFormFirstName").val();
                const lastName = $("#addFormLastName").val();
                const fullName = firstName + " " + lastName;
                $("#addName").html(fullName);
                const email = $("#addFormEmail").val();
                $("#addEmail").html(email);
                const department = $("#addFormDepartment").find(":selected").text();
                $("#addDepartment").html(department);
            });

            $("#addDepartmentConfirm").click(function() {
                $('#departmentModal').modal('show');
                const departmentName = $("#addNewDepartment").val();
                const departmentLocation = $("#addNewDepartmentLocation").find(":selected").text();
                $("#addDepartmentName").html(departmentName);
                $("#addDepartmentLocation").html(departmentLocation);
            });

            $("#addLocationConfirm").click(function() {
                $('#locationModal').modal('show');
                const locationName = $("#addNewLocation").val();
                $("#addLocationName").html(locationName);
            });

        $('#nameSearch').on('submit', function(event) {
            event.preventDefault();
            let name = $('#nameSearch').val().replace(/\s/g,'') + '%';

            $.ajax({
                url: "php/nameSearch.php",
                type: "POST",
                dataType: "json",
                data: {
                    name: name
                },
                success: function(result) {
                    getAllFunction(result);
                     },
                error: function(err) {
                    console.log('NameSearch Failed');
                }
            });
        });

        $('#searchForm').on('submit', function(event) {
            event.preventDefault();
            const values = $(this).serializeArray();

            let firstName = values[0].value;
            let lastName = values[1].value;
            let email = values[2].value;
            let department = Number(values[3].value);
            let location = Number(values[4].value);

            $.ajax({
                url: "php/searchEmployees.php",
                type: "POST",
                dataType: "json",
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    department: department,
                    location: location
                },

                success: function(result) {
                    getAllFunction(result);
                $("#searchForm")[0].reset();
                },
                error: function(error) {
                    console.log("searchEmployee failed");
                }
            });
        });

        $('#addDepartmentForm').on('submit', function(event) {
            event.preventDefault();

            const values = $(this).serializeArray();
            let name = values[0].value;
            const locationIDToSend = values[1].value;

            if(name && locationIDToSend) {
                name = capitalize(name);
                $.ajax({
                    url: "php/addDepartment.php",
                    type: "POST",
                    dataType: "json",
                    data: {
                        name: name,
                        location: locationIDToSend
                    },
                    success: function(result) {
                        $('#addDepartmentModal').modal('hide');
                        getDepartments();
                        $('#departmentChoice').trigger('click');
                    },
                    error: function(error) {
                        console.log("addDepartment failed");
                    }
                });

                $("#addDepartmentForm")[0].reset();
            } else {
                console.log('All fields required');
            };
        });

        $('#addLocationForm').on('submit', function(event) {
            event.preventDefault();
            const values = $(this).serializeArray();
            let name = values[0].value;
            if(name) {
                name = capitalize(name);
                $.ajax({
                    url: "php/addLocation.php",
                    type: "POST",
                    dataType: "json",
                    data: {
                        name: name
                    },
                    success: function(result) {
                        $('#addLocationModal').modal('hide');
                        getLocations();
                        $('#locationChoice').trigger('click');
                    },
                    error: function(error) {
                        console.log("addLocation failed");
                    }
                });

                $("#addLocationForm")[0].reset();
                } else {
                    console.log('No location entered');
            };
        });

        $("#addForm").on("submit", function(event) {

            event.preventDefault();

            const values = $(this).serializeArray();
            let firstName = values[0].value;
            let lastName = values[1].value;
            let email = values[2].value;
            let department = values[3].value;
            let departmentIDToSend = department;

            if(firstName && lastName && email && department) {
                $("#addForm")[0].reset();
                
                firstName = capitalize(firstName);  
                lastName = capitalize(lastName);
        
                $.ajax({
                    url: "php/addEmployee.php",
                    type: "POST",
                    dataType: "json",
                    data: {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        department: departmentIDToSend
                    },
                    success: function(result) {
                        $('#addEmployeeModal').modal('hide');
                        getAll();
                    },
                    error: function(error) {
                        console.log("addEmployee failed");
                    }
                });
            } else {
                    console.log('all fields required');
                    };
        });

        $('#deleteEmployeeSubmit').click(function() {
            $.ajax({
                url: 'php/deleteEmployee.php',
                type: 'POST',
                data: {
                    id: employeeIDToDelete
                },
                
                success: function(result) {
                    getAll();
                },
                error: function(error) {
                    console.log("Delete employee failed");
                }
            });
        });

        $('#deleteDepartmentSubmit').click(function() {
            $.ajax({
                url: 'php/deleteDepartment.php',
                type: 'POST',
                data:{
                    id: departmentIDToDelete
                },
                    
                success: function(result) {
                    getDepartments();
                },
                error: function(error) {
                    console.log("Delete department failed");
                }
            });
        });

        $('#deleteLocationSubmit').click(function() {
            $.ajax({
                url: 'php/deleteLocation.php',
                type: 'POST',
                data: {
                    id: locationIDToDelete
                },
                
                success: function(result) {
                    getLocations();
                },
                error: function(error) {
                    console.log("Delete location failed");
                }
            });
        });

        $('#updateEmployeeConfirm').click(function() {
            const firstName = capitalize($("#updateEmployeeFormFirstName").val());
            const lastName = capitalize($("#updateEmployeeFormLastName").val());
            const email = $("#updateEmployeeFormEmail").val();
            const departmentID = Number($("#updateEmployeeFormDepartment").val());

            $.ajax({
                url: 'php/updateEmployee.php',
                type: 'POST',
                data: {
                    id: employeeIDToUpdate,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    departmentID: departmentID,
                },
                
                success: function(result) {
                    getAll();
                },
                error: function(error) {
                    console.log("update employee failed");

                }
            });
        });

        $('#updateDepartmentConfirm').click(function() {
            const name = capitalize($("#updateDepartmentFormName").val());
            const locationID = Number($("#updateDepartmentFormLocation").val());

            $.ajax({
                url: 'php/updateDepartment.php',
                type: 'POST',
                data: {
                    id: departmentIDToUpdate,
                    name: name,
                    locationID: locationID
                },
                
                success: function(result) {
                    getAll();
                    getDepartments();
                },
                error: function(error) {
                    console.log("Update department failed");

                }
            });
        });

        $('#updateLocationConfirm').click(function() {
            const name = capitalize($("#updateLocationFormName").val());
            $.ajax({
                url: 'php/updateLocation.php',
                type: 'POST',
                data: {
                    id: locationIDToUpdate,
                    name: name
                },
                
                success: function(result) {
                    getAll();
                    getLocations();
                },
                error: function(error) {
                    console.log("Update location failed");

                }
            });
        });
  
        $('#mainPage').trigger('click');