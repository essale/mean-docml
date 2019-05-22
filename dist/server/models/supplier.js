"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var supplierSchema = new mongoose.Schema({
    supplierName: String,
    address: String,
    phoneNumber: Number,
    faxNumber: Number,
    email: { type: String, unique: true, lowercase: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    invoiceScheme: JSON
});
var Supplier = mongoose.model('Supplier', supplierSchema);
exports.default = Supplier;
//# sourceMappingURL=supplier.js.map