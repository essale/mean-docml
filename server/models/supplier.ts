import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
    supplierName: String,
    address: String,
    phoneNumber: Number,
    faxNumber: Number,
    email: {type: String, unique: true, lowercase: true, trim: true},
    createdAt: {type: Date, default: Date.now},
    invoiceScheme: JSON
});

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
