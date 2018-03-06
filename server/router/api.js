//MODULES
import express from 'express'

//INIT
//import Department from '../controller/Department'

const app = express.Router()
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json')
  next()
})

//ROUTER
//app.use('/departments', Department)

export default app 