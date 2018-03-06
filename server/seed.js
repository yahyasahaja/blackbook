//SQL
// import sql from './connection'
// import moment from 'moment'

/*
drop table DepartmentLocations
drop table DeptManagedByEmployees
drop table EmployeeWorksOnProjects
drop table Projects
drop table Names
drop table Employees
drop table Departments
drop table Dependents

*/
 
//SEEDS
export default async () => {
  
}

// function printPrototype(obj, i) {
//   var n = Number(i || 0)
//   var indent = Array(2 + n).join('-')

//   for (var key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       console.log(indent, key, ': ', obj[key])
//     }
//   }

//   if (obj) {
//     if (Object.getPrototypeOf) {
//       printPrototype(Object.getPrototypeOf(obj), n + 1)
//     } else if (obj.__proto__) {
//       printPrototype(obj.__proto__, n + 1)
//     }
//   }
// }