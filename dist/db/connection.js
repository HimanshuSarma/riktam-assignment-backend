// import mysql, { Pool, Connection } from 'mysql';
// import mongoose, { Connection } from 'mongoose';
import { connectDB } from './mongodb/createConnection.js';
// console.log(process.env.aws_rds_mysql_host, parseInt(process.env.aws_rds_mysql_port as string), process.env.aws_rds_mysql_password as string);
// const dbConnectionPool: Connection = mysql.createConnection({
//     host: process.env.aws_rds_mysql_host as string,
//     port: parseInt(process.env.aws_rds_mysql_port as string),
//     password: process.env.aws_rds_mysql_password as string,
//     user: process.env.aws_rds_mysql_user as string,
//     database: 'defaultdb'
// });
// dbConnectionPool.connect((err) => {
//     if (err) {
//         console.log(err, 'db connection error');
//         return;
//     }
//     console.log('db connection successful!');
//     return;
// })
export { connectDB };
//# sourceMappingURL=connection.js.map