const BaseModel = require('../../core/model/BaseModel');

class Blog extends BaseModel {
    constructor() {
        super('blogs');
        this.fillable = []; // Define your fillable columns here
    }
}

module.exports = new Blog();