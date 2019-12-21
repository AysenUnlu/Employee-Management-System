//Dependencies
const mysql=require("mysql");
const inquirer=require("inquirer");
const cTable=require("console.table");


//Set up Connection
const connection= mysql.createConnection({
        host:"localhost",
        port: 3306,
        user:"root",
        password:"orhanpamuk77",
        database:"employee_managementDB"
});

//Connect to the database
connection.connect((err)=>{
    if (err) throw err;
    console.log("connected as id "+connection.threadId+"\n");
    //user inputs the query choices
    input();
})
//Lists the queries!!
function input(){
    inquirer
    .prompt([
        {
            type:"list",
            name:"query",
            message:"Please chose one of the queries",
            choices:["View Departments","View Roles","View Employees","View Employees By Manager","View Budget of Department"
                    ,"Add Department","Add Role","Add Employee",
                     "Update Employee Role","Update Employee Manager","Delete Department",
                     "Delete Role","Delete Employee","Quit"]
        }
    ]).then(answer=>{

        switch(answer.query){
           
            case "View Departments": View("department");break;
            case "View Roles": View("role");break;
            case "View Employees": View("employee");break;
            case "View Employees By Manager":EmployeesByManager();break;
            case "View Budget of Department":BudgetOfDepartment();break;
            case "Add Department": AddDepartment();break;
            case "Add Role": AddRoles();break;
            case "Add Employee": AddEmployee();break;
            case "Update Employee Role": UpdateEmployeeRole();break;
            case "Update Employee Manager":UpdateEmployeeManager();break;
            case "Delete Department":DeleteDepartment();break;
            case "Delete Role":DeleteRole();break;
            case "Delete Employee":DeleteEmployee();break;
            case "Quit":connection.end(); break;

        }

    });
}
///////////////////////////////////////////////////////
//////VIEW TABLES-DEPARTMENT,ROLE,EMPLOYEE////////////
/////////////////////////////////////////////////////
   //the table is printed on the screen
   function View(table){
       
        connection.query("SELECT * FROM "+ table,(err,data)=>{          
            if (err) throw err;
            console.log();
           if(data.length!==0){ 
            console.table(data);  
           }
           else{
               console.log("No "+table+" to view!!");
           }     
              
            input();
        });    
    }

/////////////////////////////////////////////////////////////  
//////ADD A NEW DEPARTMENT//////////////////////////////////
/////////////////////////////////////////////////////////// 
//Adds a new department to the department table
function AddDepartment(){
    inquirer
    .prompt([{
        type:"input",
        name:"deptName",
        message:"Please enter the NAME of the new DEPARTMENT:"

    }]).then(answer=>{
        connection.query("INSERT INTO department SET ?",{name:answer.deptName},(err)=>{
                    if (err) throw err;
                    console.log("You successfully created a new department!!");
                    input();
        });
    })
}
////////////////////////////////////////
//returns the id of the department from its name
async function findDepartmentID(name){
    return  new Promise((resolve,reject)=>{ 
        connection.query("SELECT id FROM department WHERE name=?",name,(err,data)=>{          
                    if (err) reject(err);
                    resolve(data);
        });   
    });
    
}
//returns the data for the table employee,role or department
async function apiTable(table){
   return  new Promise((resolve,reject)=>{ 
    connection.query("SELECT * FROM "+table,(err,data)=>{          
                if (err) reject(err);
                resolve(data);
    });   
   });
}
////////////////////////////////
//find the id of a role from its name:
async function findRoleID(title){
    return  new Promise((resolve,reject)=>{ 
        connection.query("SELECT id FROM role WHERE title=?",title,(err,data)=>{          
                    if (err) reject(err);
                    resolve(data);
        });   
       });
}
////////////////////////////////
//Find Employee Id from first name and last name
async function findEmployeeID(fname,lname){
    return  new Promise((resolve,reject)=>{ 
        const query=connection.query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?",[fname,lname],(err,data)=>{          
                    if (err) reject(err);
                    resolve(data);
        });  
     
       });

}
//Return existing departments in an array; if no department is found, returns the message
async function listDepartments(){
    try{
        const deptArr=[];
       let data=await apiTable("department");

        for(let i=0;i<data.length;i++){
                deptArr.push(data[i].name);
        }
        if(deptArr.length!==0){
          return deptArr;
        }
        else{
              return["No Departments!!"];
             
        }
      
       }
       catch(err){throw err;} 

}
//Return existing Roles in an array; if no role is found, returns the message
async function listRoles(){
    try{
        const roleArr=[];
      let  data=await apiTable("role");

        for(let i=0;i<data.length;i++){
                roleArr.push(data[i].title);
        }
        if(roleArr.length!==0){
          return roleArr;
        }
        else{
             return ["No Roles"];
        }  
      
       }
       catch(err){throw err;} 

    
}
//Return existing employees-possible managers in an array. "None" is also an element of the array in case no managers is chosen; 
async function listManagers(){
    try{
        const managerArr=[];
       let  data=await apiTable("employee");

        for(let i=0;i<data.length;i++){
                managerArr.push(data[i].first_name+" "+data[i].last_name);
        }
        managerArr.push("None");
        return managerArr;
      
       }
       catch(err){throw err;}

}
//Return existing Employees in an array; if no employee is found, returns the message
async function listEmployees(){
    try{
        const employeeArr=[];
      let  data=await apiTable("employee");

        for(let i=0;i<data.length;i++){
                employeeArr.push(data[i].first_name+" "+data[i].last_name);
        }
        if(employeeArr.length!==0){
           return employeeArr;
        }
        else{
            return["No Employees"];
            
        }   
      
       }
       catch(err){throw err;}

}
////////////////////////////////////////////////////////////////////
/////////ADD A NEW ROLE FOR A DEPARTMENT////////////////////////////
//////////////////////////////////////////////////////////////////
 function AddRoles(){
    
    inquirer
    .prompt([{
        type:"input",
        name:"title",
        message:"Please enter the TITLE of the ROLE:"
    },
    {
        type:"input",
        name:"salary",
        message:"Please enter the SALARY for the ROLE:"

    },
    {
        type:"list",
        name:"department",
        message:"Please chose the DEPARTMENT for the ROLE:",
        choices:function(){
           const deptArr=listDepartments();
           return deptArr;

        }
    }]).then(async function(answer){
        //When there are no departments to list, the program returns to the query meni
        if(answer.department!=="No Departments!!"){
          const title=answer.title;   //get the title of the role
          const salary=answer.salary; //get the salary of the role
          const deptObj = await findDepartmentID(answer.department); //from the department name, find department ID
          const department_id=deptObj[0].id;
          //create a new role
          connection.query("INSERT INTO role SET ?",{title:title,
                                                     salary:salary,
                                                     department_id:department_id},(err,res)=>{
                if (err){throw err;}
                console.log("You successfully created a new role!!!");
                input();

          });
        } 
        else{
            input();
        } 
        
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////
////ADD AN EMPLOYEE//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
 function AddEmployee(){
    inquirer
    .prompt([
        {
            type:"input",
            name:"firstName",
            message:"Please enter the FIRST NAME of the EMPLOYEE:"
        },
        {
            type:"input",
            name:"lastName",
            message:"Please enter the LAST NAME of the EMPLOYEE:"
        },
        {
            type:"list",
            name:"role",
            message:"Please chose the role of the employee:",
            choices:function(){
               const roleArr=listRoles();
               return roleArr;
    
            }
        } ,   
        {
            type:"list",
            name:"manager",
            message:"Please chose a manager for the employee:",
            choices:function(){
               const managerArr=listManagers();
               return managerArr
    
            }
        }
        
    ]).then(async function(answer){ 
       if(answer.role!=="No Roles"){ 
         const firstName=answer.firstName;//get first name of employee
         const lastName=answer.lastName;//get last name of employee
         const roleName=answer.role;//get the role of the employee from possible role choices
         let roleID=0; 
         let managerFirstName="";
         let managerLastName="";

         if (answer.manager!=="None"){ //if there's a manager of the employee, split the name to first and last name
            const arr =split(answer.manager);
            managerFirstName=arr[0].trim();
            managerLastName=arr[1].trim();
           let managerID=0;
         }  
         else{
             managerID=null; //if there is not a emplouee manager, assign null
         }
         try{

           let rio= await findRoleID(roleName); //find the role id from role name
           roleID=rio[0].id;
           if(answer.manager!="None"){
              let eio=await findEmployeeID(managerFirstName,managerLastName) ; //find the employee id from employee name
               managerID=eio[0].id;
           }   
          //create a new employee  
          connection.query("INSERT INTO employee SET ?",{ first_name:firstName,
                                                             last_name:lastName,
                                                             role_id:roleID,
                                                             manager_id:managerID

                                                           },(err,res)=>{
                                                               if (err) throw err;
                                                               console.log("You successfully created a new employee!!");
                                                               input();

                                                           });
            
          
        
        }
        catch(err){throw err;}
     }
     else{
         input();
     }  
       
  });
}
///////////////////////////////////////////////////////////////
///UPDATE EMPLOYEE'S ROLE//////////////////////////////////////
///////////////////////////////////////////////////////////////
function UpdateEmployeeRole(){
    let data;
    inquirer
    .prompt([
        {
            type:"list",
            name:"employee",
            message:"Which EMPLOYEE would you like to update the ROLE of?",
            choices:function(){
               const employeeArr=listEmployees();
               return employeeArr;
    
            }
        },
        {
            type:"list",
            name:"role",
            message:"Please chose the role of the employee:",
            choices:function(){
               const roleArr=listRoles();
               return roleArr;
    
            }
        } ,   
    ]).then(async function(answer){ 
        //If there are no employees to update or roles to assign to, get back to query menu
       if(answer.employee!=="No Employees" && answer.role!=="No Roles") {
        const arr=split(answer.employee);
        const employeeFirstName=arr[0].trim();
        const employeeLastName=arr[1].trim();
        let eio=await findEmployeeID(employeeFirstName,employeeLastName) ; //from employee name, find employee id
        const employeeID=eio[0].id;
        let rid=await findRoleID(answer.role);//from role name, find role id
        const roleID=rid[0].id;
        //Update the employee with the id and set its role to corresponding role id
        connection.query("UPDATE employee SET ? WHERE id= ?",[{role_id:roleID,},employeeID],(err,res)=>{
                    if (err) throw err;
                    console.log("Employee role of "+answer.employee+" with ID "+employeeID+" updated successfully");
                    input();
        });
       }
       else{input();} 

    });

}
////////////////////////////////////////////////////////////
////UPDATE EMPLOYEE'S MANAGER//////////////////////////////
//////////////////////////////////////////////////////////
function UpdateEmployeeManager(){
    let data;
    inquirer
    .prompt([
        {
            type:"list",
            name:"employee",
            message:"Which EMPLOYEE would you like to update the MANAGER of?",
            choices:function(){

               const employeeArr=listEmployees();
               return employeeArr;
    
            }
        }]).then(answer=>{
            //if no employees found to update the manager of, the program goes to query menu
           if(answer.employee!=="No Employees"){ 
            inquirer
            .prompt([{
                type:"list",
                name:"manager",
                message:"Who's the manager of "+answer.employee+"?",
                choices:async function(){ //List employees other than the updated one
                try{
                const managerArr=[];
                data=await apiTable("employee");
    
                for(let i=0;i<data.length;i++){
                        managerCandidate=data[i].first_name+" "+data[i].last_name;
                        if(managerCandidate!=answer.employee){//employee manager can't be itself
                            managerArr.push(data[i].first_name+" "+data[i].last_name);
                        }    
                }
                managerArr.push("None");

                return managerArr;
              
               }
               catch(err){throw err;} 
    
            }

            }]).then(async function (answer2){
                const arr=split(answer.employee);
                const employeeFirstName=arr[0].trim();
                const employeeLastName=arr[1].trim();
                let eio=await findEmployeeID(employeeFirstName,employeeLastName) ;//find the employee id from the name entered by menu
                const employeeID=eio[0].id;

                let managerID=0;
                
                if (answer2.manager!=="None"){
                   
                      const arr=split(answer2.manager)
                      const managerFirstName=arr[0];
                      const managerLastName=arr[1];
                   
                   console.log(managerFirstName);
                   eio=await findEmployeeID(managerFirstName.trim(),managerLastName.trim()) ; //find employee id for the manager
                   console.log(eio);
                    managerID=eio[0].id;
                } 
                else{
                    managerID=null;
                }  
                //update the manager ID of the employee with the found id
                connection.query("UPDATE employee SET ? WHERE id= ?",[{manager_id:managerID},employeeID],(err,res)=>{
                                if (err) throw err;
                                console.log("The manager of "+answer.employee+" is set to "+answer2.manager+"!!");
                                input();
                });


                 
            });
           }
           else{
               input();
           }  
        });

}
//////////////////////////////////
//Returns the first name and last name;the middle name included in the first name.
function split(name){
    const nameArr=[];
    const arr=name.split(" ");
    const LastName=arr[arr.length-1];
    let FirstName="";
    for(let i=0;i<arr.length-1;i++){
        FirstName+=" "+arr[i];
    }
    nameArr.push(FirstName);
    nameArr.push(LastName);

    return nameArr;


}
////////////////////////////////////////////////////////////
/////VIEW EMPLOYEES BY MANAGER/////////////////////////////
///////////////////////////////////////////////////////////
///Find Managers who has an employee,inner join is used
async function findManagers(){
    return  new Promise((resolve,reject)=>{ 
     connection.query("SELECT E1.first_name as employeeName,E1.last_name as employeeLastname,E2.first_name as managerName,E2.last_name as managerLastname FROM employee as E1 INNER JOIN employee AS E2 WHERE E1.manager_id=E2.id ",(err,data)=>{          
                 if (err) reject(err);
                 resolve(data);
     });   
    });
 }
//View Employees By Manager
function EmployeesByManager(){
    let data;
    
    inquirer
    .prompt([
        {
            type:"list",
            name:"employee",
            message:"Which MANAGER would you like to list the EMPLOYEES of?",
            choices:async function(){
                try{
                const managerArr=[];
            
                
                data=await findManagers();
    
                for(let i=0;i<data.length;i++){
                       const manager=data[i].managerName+" "+data[i].managerLastname;
                       //Since one manager can be manager of many employees, the list should include only one copy of the name
                       if(managerArr.indexOf(manager)==-1){
                         managerArr.push(manager);
                       }  
                }
                //Check managers exist
                if(managerArr.length!==0){
                   return managerArr;
                }
                else{
                    return ["No Managers"];
                    
                }   
                    
               }
               catch(err){throw err;} 
    
            }
        }]).then(answer=>{
           //If there are no managers, go back to query menu, otherwise list the employees name and last name 
           if(answer.employee!=="No Managers"){ 
            const empArr=[];
            const arr=split(answer.employee);
            const managerFirstName=arr[0].trim();
            const managerLastName=arr[1].trim();
            for (let i=0;i<data.length;i++){
                if(data[i].managerName===managerFirstName && data[i].managerLastname===managerLastName){
                    empArr.push({"Employee Name":data[i].employeeName+" "+data[i].employeeLastname});
                }
            }
            console.table(empArr);
          }  
            input();
          
        });
            
}
///////////////////////////////////////////////////////////////////////////////
////DELETE DEPARTMENTS////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//Delete a user specified department
function DeleteDepartment(){
    let data;
    inquirer
    .prompt([
    {
        type:"list",
        name:"department",
        message:"Please chose a DEPARTMENT to DELETE:",
        choices:function(){
           
           const deptArr=listDepartments();
           return deptArr;

        }
    }]).then(async function(answer){
         
        if(answer.department!=="No Departments!!"){
          const deptObj = await findDepartmentID(answer.department);
          const department_id=deptObj[0].id;
          connection.query("DELETE FROM department WHERE id=?",department_id,(err,res)=>{
                if (err){throw err;}
                console.log("You successfully deleted the department "+answer.department);
                input();

          });
        }
        else{
            input();
        }  
        
    });
    
}
///////////////////////////////////////////////////////////////////////////////
////DELETE ROLES////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
function DeleteRole(){
    let data;
    inquirer
    .prompt([
        {
            type:"list",
            name:"role",
            message:"Please chose a role to delete:",
            choices:function(){

               const roleArr=listRoles();
               return roleArr;
    
            }
        } ,   
    ]).then(async function(answer){ 
       if(answer.role!=="No Roles!!"){
        let rid=await findRoleID(answer.role);
        const roleID=rid[0].id;

        connection.query("DELETE FROM role WHERE id=?",roleID,(err,res)=>{
                    if (err) throw err;
                    console.log("The role '"+answer.role+"' has been deleted!!");
                    input();
        });
      }
      else{
          input();
      }


    });

}
/////////////////////////////////////////////////////////////////////////////////
//////////DELETE AN EMPLOYEE////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function DeleteEmployee(){
    let data;
    inquirer
    .prompt([
        {
            type:"list",
            name:"employee",
            message:"Which EMPLOYEE would you like to DELETE?",
            choices:function(){
               
               const employeeArr=listEmployees();
               return employeeArr;
    
            }
        }]).then(async function(answer){
           if(answer.employee!=="No Employees!!"){ 
            const arr=split(answer.employee);
            const employeeFirstName=arr[0].trim();
            const employeeLastName=arr[1].trim();
            let eio=await findEmployeeID(employeeFirstName,employeeLastName) ;
            console.log(eio);
            const employeeID=eio[0].id;
            connection.query("DELETE FROM employee WHERE id= ?",employeeID,(err,res)=>{
                        if (err) throw err;
                        console.log("The Employee with Name `"+answer.employee+"` is deleted!!!");
                        input();
            });
         }
         else{
             input();
         }  


        });

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////VIEW THE TOTAL UTILIZED BUDGET OF A DEPARTMENT -- ie the combined salaries of all employees in that department
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function BudgetOfDepartment(){
    let data;
    inquirer
    .prompt([
    {
        type:"list",
        name:"department",
        message:"Please choose a DEPARTMENT to VIEW UTILIZED BUDGET:",
        choices:function(){

           const deptArr=listDepartments();
           return deptArr;

        }
    }]).then(async function(answer){
        if(answer.department!=="No Departments!!"){
         
          connection.query("SELECT department.name,SUM(role.salary) AS Budget"+
                           " FROM role INNER JOIN employee INNER JOIN department WHERE department.name=? AND"+
                           " department.id=role.department_id AND employee.role_id=role.id"+
                           " GROUP BY role.department_id"
                           ,answer.department,(err,data)=>{
                if (err){throw err;}
                //if no data is returned, it means there are no employees in the department
                if(data.length!==0){
                   console.table(data);
                }
                else{
                    console.log("No Utilized Budget!!")
                }   
                input();

          });
        }
        else{
            input();
        }  
        
    });
}