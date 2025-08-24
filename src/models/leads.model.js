import mongoose,{Schema} from "mongoose"

const leadSchema = new Schema({
    first_name:{
        type:String,
        trim:true,
        required:true
    },
    last_name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    phone: { 
        type: String,
        required: true,
        trim: true 
    },
    company: { 
        type: String, 
        trim: true, 
        default: "" 
    },
    city: { 
        type: String, 
        trim: true, 
        default: "" 
    },
    state: { type: String, 
        trim: true, 
        default: "" 
    },
    source: { 
        type: String, 
        enum: ["website","facebook_ads","google_ads","referral","events","other"], default: "other" 
    },
    status: { 
        type: String, 
        enum: ["new","contacted","qualified","lost","won"], default: "new" 
    },
    score: { 
        type: Number, 
        min: 0, 
        max: 100, 
        default: 0 
    },
    lead_value: { 
        type: Number, 
        default: 0 
    },
    last_activity_at: { 
        type: Date, 
        default: null 
    },
    is_qualified: { 
        type: Boolean, 
        default: false 
    },
    
}, { timestamps: true });

export const Lead=mongoose.model("Lead",leadSchema)