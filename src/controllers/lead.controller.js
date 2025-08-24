import { asyncHandler } from "../utils/asyncHandler.js";
import { Lead } from "../models/leads.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createLead=asyncHandler(
    async(req,res,next)=>{
        const {
            first_name,
            last_name,
            email,
            phone,
            company,
            city,
            state,
            source,
            status,
            lead_value,
            is_qualified
        }=req.body

        if(!email||!phone){
            throw new ApiError(400,"Phone and Email required")
        }
        const isExist= await Lead.findOne({email})
        if (isExist){
            throw new ApiError(401,"Already Exist")
        }
        const lead=await Lead.create({
            first_name,
            last_name,
            email,
            phone,
            company,
            city,
            state,
            source,
            status,
            lead_value,
            is_qualified
        })
        return res.status(201).json(new ApiResponse(201, lead, "Lead created successfully"));


    }
)

const updateLead= asyncHandler(
    async(req,res,next)=>{
        const {id}=req.params
        const lead = await Lead.findByIdAndUpdate(id, req.body, {new: true});

    if (!lead) {
        throw new ApiError(404, "lead not found");
    }

    return res.status(200).json(new ApiResponse(200, lead, "Lead updated successfully"));
});

const deleteLead=asyncHandler(
    async(req,res,next)=>{
        const {id}=req.params
        if(!id){
            throw new ApiError(404,"lead not present")
        }
        const deleted=await Lead.findByIdAndDelete(id)
        if (deleted){
            return res.status(200).json(new ApiResponse(201, deleted, "Lead deleted successfully"));
        }
    }
)

const getsingleLead = asyncHandler(
    async(req,res,next)=>{
        const {id} = req.params
        const singleLead = await Lead.findById(id)
        if(!singleLead){
            throw new ApiError(404,"lead not present")
        }
        return res.status(200).json(new ApiResponse(200,singleLead,"Single Lead found"))
    }
)

const getallLeads = asyncHandler(async (req, res, next) => {
  
    let { page = 1, limit = 20, status, source, city, state } = req.query;

    page = parseInt(page);
    limit = Math.min(parseInt(limit), 100); 

    
    const filter = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (city) filter.city = city;
    if (state) filter.state = state;

    
    const total = await Lead.countDocuments(filter);

    const data = await Lead.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    return res.status(200).json({
        data,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    });
});

export  {
    createLead,
    updateLead,
    deleteLead,
    getsingleLead,
    getallLeads 
}