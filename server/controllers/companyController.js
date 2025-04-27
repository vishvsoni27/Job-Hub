import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../util/generateToken.js";
import Job from "../models/Job.js";

// Register a new company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;

  const imageFile = req.file;
  if (!name || !email || !password || !imageFile) {
    return res
      .status(400)
      .json({ succcess: false, message: "Missing Details" });
  }

  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.status(400).json({
        succcess: false,
        message: "Company already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(hashedPassword);

    const imageUpload = await cloudinary.uploader
      .upload(imageFile.path)
      .catch((error) => {
        return res.status(500).json({
          succcess: false,
          message: "Cloudinary Error : " + error.message,
        });
      });

    const company = new Company({
      name,
      email,
      password: hashedPassword,
      image: imageUpload.secure_url,
    });

    await company.save();
    return res.status(200).json({
      succcess: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      message: "Company registered successfully",
      token: generateToken(company._id),
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ succcess: false, message: "Internal Error : " + error.message });
  }
};

// Company login
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await Company.findOne({ email });

    if (bcrypt.compare(password, company.password)) {
      res.status(200).json({
        succcess: true,
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },
        message: "Company logged in successfully",
        token: generateToken(company._id),
      });
    } else {
      return res.status(400).json({
        succcess: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log("Inside loginCompany : " + error);
    return res
      .status(500)
      .json({ succcess: false, message: "Internal Error : " + error.message });
  }
};

// Get company data
export const getCompanyData = async (req, res) => {
  try {
    const company = req.company;
    res.status(200).json({
      succcess: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      succcess: false,
      message: "Internal Error : " + error.message,
    });
  }
};

// Post a new job
export const postJob = async (req, res) => {
  const { title, description, location, salary, level, category } = req.body;

  const companyId = req.company._id;

  try {
    const newJob = await Job.create({
      title,
      description,
      location,
      salary,
      companyId,
      date: Date.now(),
      level,
      category,
    });

    await newJob.save();

    res.json({
      succcess: true,
      message: newJob,
    });
  } catch {
    res.json({
      succcess: false,
      message: "Error in posting job : " + error.message,
    });
  }
};

// Get Company Job Applicants
export const getCompanyJobApplicants = async (req, res) => {};

// Get Company Posted Jobs
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ companyId });

    res.status(200).json({
      succcess: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      succcess: false,
      message: "Internal Error : " + error.message,
    });
  }
};

// Change Job Application Status
export const changeJobApplicationStatus = async (req, res) => {};

// Chnage job visibility
export const changeVisibility = async (req, res) => {
  try {
    const { id } = req.body;

    const companyId = req.company._id;

    const job = await Job.findById(id);

    if (companyId.toString() === job.companyId.toString()) {
      job.visible = !job.visible;
    }
    await job.save();

    res.status(200).json({ success: true, message: job });
  } catch (error) {
    res.status(500).json({
      succcess: false,
      message: "Internal Error : " + error.message,
    });
  }
};
