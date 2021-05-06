const mysql = require('mysql2');
const config = require('../config/database-config');

const connection = mysql.createConnection(config);

function createTable() {
    connection.query(
        'create table if not exists laptops ( ' +
        'laptopId integer primary key auto_increment,' +
        'manufacturer varchar(60),' + 
        'size varchar(4),' + 
        'resolution varchar(15),' + 
        'screenType varchar(10),' +
        'touch char(3),' + 
        'processorName varchar(60),' + 
        'physicalCores integer,' + 
        'clockSpeed integer,' + 
        'ram varchar(5),' + 
        'storage varchar(6),' + 
        'discType char(3),' + 
        'graphicCardName varchar(60),' + 
        'vram varchar(5),' + 
        'os varchar(60),' + 
        'discReader varchar(20)' + 
        ')',
        null
    );
}

module.exports = {
    createTable,
    connection
}