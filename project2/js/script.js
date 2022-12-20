let employeeIDToDelete;
let departmentIDToDelete;
let locationIDToDelete;

let employeeIDToUpdate;
let departmentIDToUpdate;
let locationIDToUpdate;

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
            $('#content').empty();

            let sortedEmployees = result.data.sort(function(a, b) {
                if(a.firstName < b.firstName) {
                    return -1;
                }
                if(a.firstName > b.firstName) {
                    return 1;
                }
                return 0;
            });

            let employeeCounter = 0;

            sortedEmployees.forEach(employee => {
                employeeCounter += 1;
                let employeeId = "employee" + employeeCounter;
                let databaseEmployeeID = employee.id

                let employeeBox = '<div id='+ employee.email +' class="employeeBox" tabindex="1"><p class="employeeName" >' + 
                    employee.firstName + " " + employee.lastName + '</p><i class="fa-solid fa-envelope"></i><p>' + employee.email + 
                    '</p><i class="fa-solid fa-briefcase"></i><p>' + employee.department + '</p><i class="fa-solid fa-location-dot"></i><p>' + 
                    employee.location +'</p><p style="display:none">'+ databaseEmployeeID +'</p><p style="display:none">'+ employee.departmentID +'</p><button id=' + employeeId + 'Edit' + ' class="updateEmployee myButton btn btn-primary">Edit</button><button id=' + 
                    employeeId + 'Delete' + ' class="deleteEmployee myButton btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal">Delete</button></div><p class="splitter"></p>';

                $("#content").append(employeeBox);
            });

            $('.deleteEmployee').unbind();

            $(".deleteEmployee").bind('click', function(e) {
                const employee = $(this).parent().children();

                $('#deleteEmployeeName').html($(employee[0]).text());
                $('#deleteEmployeeEmail').html($(employee[2]).text());
                $('#deleteEmployeeDepartment').html($(employee[4]).text());
                $('#deleteEmployeeLocation').html($(employee[6]).text());
                $('#deleteEmployeeID').html('<p>ID #' + $(employee[7]).text() + '</p>');

                employeeIDToDelete = $(employee[7]).text();
            });

            $('.updateEmployee').unbind();

            $(".updateEmployee").bind("click", function(e) {
                const employee = $(this).parent().children();
                const nameSplit = $(employee[0]).text().split(" ");
                $('#updateEmployeeFormFirstName').val(nameSplit[0]);
                $('#updateEmployeeFormLastName').val(nameSplit[1]);
                    $('#updateModalEmployeeName').html($(employee[0]).text());
                $('#updateEmployeeFormEmail').val($(employee[2]).text());
                    $('#updateModalEmployeeEmail').html($(employee[2]).text());
                $('#updateEmployeeFormDepartment').val($(employee[8]).text());
                    $('#updateModalEmployeeDepartment').html($(employee[4]).text());
                    $('#updateModalEmployeeLocation').html($(employee[6]).text());

                    $("#blankUpdateEmployee").css("display", "block");

                employeeIDToUpdate = $(employee[7]).text();
            });
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
                $("#departmentList").empty();

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

                        $("#departmentList").append('<li class="departmentsLocationsBox" tabindex=1>'+ name + 
                        '<br><p style="display:none">'+ name +'</p><p style="display:none">'+ department.id +'</p><p style="display:none">'+ department.location +'</p><p style="display:none">'+ department.locationID +'</p><button class="updateDepartment boxButtons myButton btn btn-primary">Edit</button><button class="deleteDepartment boxButtons myButton btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal">Delete</button></li><p class="splitter"></p>');
                        $('#searchFormDepartment').append('<option value=' + department.id + '>' + name + '</option>');
                        $('#addFormDepartment').append('<option value=' + department.id + '>' + name + '</option>');
                        $('#updateEmployeeFormDepartment').append('<option value=' + department.id + '>' + name + '</option>');
                    };
                });

                $('.deleteDepartment').unbind();

                $(".deleteDepartment").bind('click', function() {
                    let department = $(this).parent().children()[1];
                    $('#deleteDepartmentName').html($(department).text());                     
                    departmentIDToDelete = Number($($(this).parent().children()[2]).text());
                });

                $('.updateDepartment').unbind();

                $(".updateDepartment").bind('click', function(e) {
                    const department = $(this).parent().children();
                    $('#updateDepartmentFormName').val($(department[1]).text());
                        $('#updateModalDepartmentDepartment').html($(department[1]).text());
                    $('#updateDepartmentFormLocation').val($(department[3]).text().toLowerCase().replace(/\s/g,''));
                        $('#updateModalDepartmentLocation').html($(department[3]).text());
                    
                    $("#blankUpdateDepartment").css("display", "block");

                    departmentIDToUpdate = $(department[2]).text();
                });
        },
        error: function(err) {
            console.log(err, "departments error");
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
                $('#locationList').empty();

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

                        $("#locationList").append('<li class="departmentsLocationsBox" tabindex=1>'+ name + 
                        '<br><p style="display:none">'+ name +'</p><p style="display:none">'+ location.id +'</p><button class="updateLocation boxButtons myButton btn btn-primary">Edit</button><button class="deleteLocation boxButtons myButton btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteLocationModal">Delete</button></li><p class="splitter"></p>')
                        $('#searchFormLocation').append('<option value=' + location.id + '>' + name + '</option>');
                        $('#addNewDepartmentLocation').append('<option value=' + location.id + '>' + name + '</option>');
                        $('#updateDepartmentFormLocation').append('<option value=' + location.id + '>' + name + '</option>');
                    };
                });

                $('.deleteLocation').unbind();

                $(".deleteLocation").bind('click', function() {
                    let location = $(this).parent().children()[1];
                    $('#deleteLocationName').html($(location).text());
                    locationIDToDelete = Number($($(this).parent().children()[2]).text());
                });

                $('.updateLocation').unbind();

                $(".updateLocation").bind('click', function(e) {
                    const location = $(this).parent().children();
                    $('#updateLocationFormName').val($(location[1]).text());
                        $('#updateModalLocationLocation').html($(location[1]).text());

                    $("#blankUpdateLocation").css("display", "block");

                    locationIDToUpdate = $(location[2]).text();
                });
                
        },
        error: function(err) {
            console.log(err, "departments error");
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

        $("#searchFormConfirm").click(function() {
                const firstName = $("#searchFormFirstName").val();
                const lastName = $("#searchFormLastName").val();
                let fullName = firstName + " " + lastName;
                if(!firstName & !lastName) {
                    fullName = "All";
                };
                $("#searchName").html("Name: " + fullName);
                let email = $("#searchFormEmail").val();
                if(!email) {
                    email = "All";
                };
                $("#searchEmail").html("Email: " + email);
                let department = $("#searchFormDepartment").find(":selected").text();
                if(!department) {
                    department = "All";
                };
                $("#searchDepartment").html("Department: " + department);
                let location = $("#searchFormLocation").find(":selected").text();
                if(!location) {
                    location = "All";
                };
                $("#searchLocation").html("Location: " + location);
        });

        $("#search").click(function() {
            $("#blankSearch").css("display", "block");
            $("#blank").css("display", "none");
            $("#blankDepartment").css("display", "none");
            $("#blankLocation").css("display", "none");
            $("#blankUpdateEmployee").css("display", "none");
            $("#blankUpdateDepartment").css("display", "none");
            $("#blankUpdateLocation").css("display", "none");
        });

        $("#mainPage").click(function() {
            $("#blank").css("display", "none");
            $("#blankDepartment").css("display", "none");
            $("#blankLocation").css("display", "none");
            $("#blankSearch").css("display", "none");
            $("#blankUpdateEmployee").css("display", "none");
            $("#blankUpdateDepartment").css("display", "none");
            $("#blankUpdateLocation").css("display", "none");
        });

        $("#employeeChoice").click(function() {
            $("#blank").css("display", "block");
            $("#blankDepartment").css("display", "none");
            $("#blankLocation").css("display", "none");
            $("#blankSearch").css("display", "none");
            $("#blankUpdateEmployee").css("display", "none");
            $("#blankUpdateDepartment").css("display", "none");
            $("#blankUpdateLocation").css("display", "none");
        });

        $("#departmentChoice").click(function() {
            $("#blankDepartment").css("display", "block");
            $("#blank").css("display", "none");
            $("#blankLocation").css("display", "none");
            $("#blankSearch").css("display", "none");
            $("#blankUpdateEmployee").css("display", "none");
            $("#blankUpdateDepartment").css("display", "none");
            $("#blankUpdateLocation").css("display", "none");
        });

            $("#addConfirm").click(function() {
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
                const departmentName = $("#addNewDepartment").val();
                const departmentLocation = $("#addNewDepartmentLocation").find(":selected").text();
                $("#addDepartmentName").html(departmentName);
                $("#addDepartmentLocation").html(departmentLocation);
            });

        $("#locationChoice").click(function() {
            $("#blankLocation").css("display", "block");
            $("#blank").css("display", "none");
            $("#blankDepartment").css("display", "none");
            $("#blankSearch").css("display", "none");
        });

            $("#addLocationConfirm").click(function() {
                const locationName = $("#addNewLocation").val();
                $("#addLocationName").html(locationName);
            });

        $('#updateEmployeeBack').click(function() {
            $("#updateEmployeeForm")[0].reset();
            $("#blankUpdateEmployee").css("display", "none");
        });

        $('#updateDepartmentBack').click(function() {
            $("#updateDepartmentForm")[0].reset();
            $("#blankUpdateDepartment").css("display", "none");
        });

        $('#updateLocationBack').click(function() {
            $("#updateLocationForm")[0].reset();
            $("#blankUpdateLocation").css("display", "none");
        });

        $('#updateEmployeeConfirm').click(function() {
            const firstName = $("#updateEmployeeFormFirstName").val();
            const lastName = $("#updateEmployeeFormLastName").val();
            const fullName = firstName + ' ' + lastName;
                $('#updateModalEmployeeNameNew').html(fullName)
            const email = $("#updateEmployeeFormEmail").val();
                $('#updateModalEmployeeEmailNew').html(email);
            const department = $("#updateEmployeeFormDepartment").find(":selected").text();
                $('#updateModalEmployeeDepartmentNew').html(department);
            const location = $("#updateEmployeeFormLocation").find(":selected").text();
                $('#updateModalEmployeeLocationNew').html(location);
        });

        $('#updateDepartmentConfirm').click(function() {
            $('#updateModalDepartmentNameNew').html($('#updateDepartmentFormName').val());
            $('#updateModalDepartmentLocationNew').html($('#updateDepartmentFormLocation').find(":selected").text());
        });

        $('#updateLocationConfirm').click(function() {
            $('#updateModalLocationNameNew').html($('#updateLocationFormName').val());
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

                    result.data.forEach(function(name) {

                        $("#content").empty();

                        let sortedEmployees = result.data.sort(function(a, b) {
                            if(a.firstName < b.firstName) {
                                return -1;
                            }
                            if(a.firstName > b.firstName) {
                                return 1;
                            }
                            return 0;
                        });


                        let employeeCounter = 0;

                        sortedEmployees.forEach(employee => {
            
                            employeeCounter += 1;
                            let employeeId = "employee" + employeeCounter;
                            let databaseEmployeeID = employee.id
            
                            let employeeBox = '<div id='+ employee.email +' class="employeeBox" tabindex="1"><p class="employeeName" >' + 
                                employee.firstName + " " + employee.lastName + '</p><i class="fa-solid fa-envelope"></i><p>' + employee.email + 
                                '</p><i class="fa-solid fa-briefcase"></i><p>' + employee.department + '</p><i class="fa-solid fa-location-dot"></i><p>' + 
                                employee.location +'</p><p style="display:none">'+ databaseEmployeeID +'</p><p style="display:none">'+ employee.departmentID +'</p><button id=' + employeeId + 'Edit' + ' class="updateEmployee myButton btn btn-primary">Edit</button><button id=' + 
                                employeeId + 'Delete' + ' class="deleteEmployee myButton btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal">Delete</button></div><div class="splitter"></div>';

                            $("#content").append(employeeBox);

                        });

                        $('.deleteEmployee').unbind();

                        $(".deleteEmployee").bind('click', function(e) {
                            const employee = $(this).parent().children();
            
                            $('#deleteEmployeeName').html($(employee[0]).text());
                            $('#deleteEmployeeEmail').html($(employee[2]).text());
                            $('#deleteEmployeeDepartment').html($(employee[4]).text());
                            $('#deleteEmployeeLocation').html($(employee[6]).text());
                            $('#deleteEmployeeID').html('<p>ID #' + $(employee[7]).text() + '</p>');
            
                            employeeIDToDelete = $(employee[7]).text();
                        });

                        $('.updateEmployee').unbind();
        
                        $(".updateEmployee").bind('click', function(e) {
                            const employee = $(this).parent().children();
                            const nameSplit = $(employee[0]).text().split(" ");
                            $('#updateEmployeeFormFirstName').val(nameSplit[0]);
                            $('#updateEmployeeFormLastName').val(nameSplit[1]);
                                $('#updateModalEmployeeName').html($(employee[0]).text());
                            $('#updateEmployeeFormEmail').val($(employee[2]).text());
                                $('#updateModalEmployeeEmail').html($(employee[2]).text());
                            $('#updateEmployeeFormDepartment').val($(employee[8]).text());
                            
                                $('#updateModalEmployeeDepartment').html($(employee[4]).text());
                                $('#updateModalEmployeeLocation').html($(employee[6]).text());
                                
            
                                $("#blankUpdateEmployee").css("display", "block");
            
                            employeeIDToUpdate = $(employee[7]).text();
                        });

                        $("#blankSearch").css("display", "none");
                        $("#blank").css("display", "none");
                        $("#blankDepartment").css("display", "none");
                        $("#blankLocation").css("display", "none");
                        $("#blankUpdateEmployee").css("display", "none");
                        $("#blankUpdateDepartment").css("display", "none");
                        $("#blankUpdateLocation").css("display", "none");
                    });
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
                    $("#content").empty();

                    let sortedEmployees = result.data.sort(function(a, b) {
                        if(a.firstName < b.firstName) {
                            return -1;
                        }
                        if(a.firstName > b.firstName) {
                            return 1;
                        }
                        return 0;
                    });


                    let employeeCounter = 0;

                    sortedEmployees.forEach(employee => {
        
                        employeeCounter += 1;
                        let employeeId = "employee" + employeeCounter;
                        let databaseEmployeeID = employee.id
        
                        let employeeBox = '<div id='+ employee.email +' class="employeeBox" tabindex="1"><p class="employeeName" >' + 
                            employee.firstName + " " + employee.lastName + '</p><i class="fa-solid fa-envelope"></i><p>' + employee.email + 
                            '</p><i class="fa-solid fa-briefcase"></i><p>' + employee.department + '</p><i class="fa-solid fa-location-dot"></i><p>' + 
                            employee.location +'</p><p style="display:none">'+ databaseEmployeeID +'</p><p style="display:none">'+ employee.departmentID +'</p><button id=' + employeeId + 'Edit' + ' class="updateEmployee myButton btn btn-primary">Edit</button><button id=' + 
                            employeeId + 'Delete' + ' class="deleteEmployee myButton btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal">Delete</button></div><div class="splitter"></div>';

                $("#content").append(employeeBox);

            });

                $('.deleteEmployee').unbind();

                $(".deleteEmployee").bind('click', function(e) {
                    const employee = $(this).parent().children();
    
                    $('#deleteEmployeeName').html($(employee[0]).text());
                    $('#deleteEmployeeEmail').html($(employee[2]).text());
                    $('#deleteEmployeeDepartment').html($(employee[4]).text());
                    $('#deleteEmployeeLocation').html($(employee[6]).text());
                    $('#deleteEmployeeID').html('<p>ID #' + $(employee[7]).text() + '</p>');
    
                    employeeIDToDelete = $(employee[7]).text();
                });

                $('.updateEmployee').unbind();
    
                $(".updateEmployee").bind('click', function(e) {
                    const employee = $(this).parent().children();
                    const nameSplit = $(employee[0]).text().split(" ");
                    $('#updateEmployeeFormFirstName').val(nameSplit[0]);
                    $('#updateEmployeeFormLastName').val(nameSplit[1]);
                        $('#updateModalEmployeeName').html($(employee[0]).text());
                    $('#updateEmployeeFormEmail').val($(employee[2]).text());
                        $('#updateModalEmployeeEmail').html($(employee[2]).text());
                    $('#updateEmployeeFormDepartment').val($(employee[8]).text());
                        $('#updateModalEmployeeDepartment').html($(employee[4]).text());
                        $('#updateModalEmployeeLocation').html($(employee[6]).text());
    
                        $("#blankUpdateEmployee").css("display", "block");
    
                    employeeIDToUpdate = $(employee[7]).text();
                });
                
                $('#blankSearch').css('display', 'none');
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
                        getDepartments();
                    },
                    error: function(error) {
                        console.log("addDepartment failed");
                    }
                });

                $("#addDepartmentForm")[0].reset();
                $("#blankDepartment").css("display", "none");
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
                        getLocations();
                    },
                    error: function(error) {
                        console.log("addLocation failed");
                    }
                });

                $("#addLocationForm")[0].reset();
                $("#blankLocation").css("display", "none");
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
                $("#blank").css("display", "none");
                
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
                        console.log("add Employee result", result);
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
                url: 'php/countEmployees.php',
                type: 'GET',
                data:{
                    id: departmentIDToDelete
                },

                success: function(result) {

                    if(result.data[0].total < 1) {
                        $.ajax({
                            url: 'php/deleteDepartment.php',
                            type: 'POST',
                            data:{
                                id: departmentIDToDelete
                            },
                                
                            success: function(result) {
                                getDepartments();
                                $("#blankDepartment").css("display", "none");
                            },
                            error: function(error) {
                                console.log("Delete department failed");
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

        $('#deleteLocationSubmit').click(function() {
            $.ajax({
                url: 'php/countDepartments.php',
                type: 'GET',
                data:{
                    id: locationIDToDelete
                },

                success: function(result) {
                    if(result.data[0].total < 1) {
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
                    } else {
                        $('#deleteLocationErrorModal').modal("toggle");
                    };

                }, 
                error: function(result) {
                    console.log('Delete location : count failed');
                }
            });
        });

        $('#updateEmployeeSubmit').click(function() {
            const firstName = $("#updateEmployeeFormFirstName").val();
            const lastName = $("#updateEmployeeFormLastName").val();
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
                    $("#blankUpdateEmployee").css("display", "none");
                    getAll();
                },
                error: function(error) {
                    console.log("update employee failed");

                }
            });
        });

        $('#updateDepartmentSubmit').click(function() {
            const name = $("#updateDepartmentFormName").val();
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
                    $("#blankUpdateDepartment").css("display", "none");
                    $("#blankDepartment").css("display", "none");
                },
                error: function(error) {
                    console.log("Update department failed");

                }
            });
        });

        $('#updateLocationSubmit').click(function() {
            const name = $("#updateLocationFormName").val();
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