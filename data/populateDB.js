const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://pranjalsrivastava:pranjal123@cluster0.lz6qq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Models
const Company = mongoose.model(
  "Company",
  new mongoose.Schema({
    name: String,
    location: String,
    linkedIn: String,
    emails: [String],
    phoneNumbers: [String],
    comments: String,
    periodicity: String,
  })
);

const CommunicationMethod = mongoose.model(
  "CommunicationMethod",
  new mongoose.Schema({
    name: String,
    description: String,
    sequence: Number,
    mandatory: Boolean,
  })
);

const Communication = mongoose.model(
  "Communication",
  new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    type: { type: mongoose.Schema.Types.ObjectId, ref: "CommunicationMethod" },
    date: Date,
    notes: String,
  })
);

const Notification = mongoose.model(
  "Notification",
  new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    communication: { type: mongoose.Schema.Types.ObjectId, ref: "Communication" },
    type: String, // 'overdue' or 'due today'
    message: String,
  })
);

// Seed Data
const seedData = async () => {
  try {
    await Company.deleteMany();
    await CommunicationMethod.deleteMany();
    await Communication.deleteMany();
    await Notification.deleteMany();

    const companies = [
      {
        name: "Alpha Tech",
        location: "Los Angeles",
        linkedIn: "https://linkedin.com/company/alphatech",
        emails: ["info@alphatech.com"],
        phoneNumbers: ["+1 234 567 8901"],
        comments: "High-growth potential client.",
        periodicity: "Weekly",
      },
      {
        name: "Beta Innovations",
        location: "Austin",
        linkedIn: "https://linkedin.com/company/betainnovations",
        emails: ["contact@betainnovations.com"],
        phoneNumbers: ["+1 765 432 1098"],
        comments: "Excellent for collaboration.",
        periodicity: "Bi-weekly",
      },
    ];

    const createdCompanies = await Company.insertMany(companies);

    const communications = [
      { name: "Newsletter", description: "Send a monthly newsletter", sequence: 1, mandatory: true },
      { name: "Social Media Outreach", description: "Engage via social platforms", sequence: 2, mandatory: true },
      { name: "Follow-Up Call", description: "Phone follow-up with clients", sequence: 3, mandatory: false },
    ];

    const createdMethods = await CommunicationMethod.insertMany(communications);

    const communicationEntries = [
      {
        company: createdCompanies[0]._id,
        type: createdMethods[0]._id,
        date: new Date(),
        notes: "Shared our December updates via the newsletter.",
      },
      {
        company: createdCompanies[1]._id,
        type: createdMethods[1]._id,
        date: new Date(),
        notes: "Discussed collaboration opportunities on social media.",
      },
    ];

    const createdCommunications = await Communication.insertMany(communicationEntries);

    const notifications = [
      {
        user: new mongoose.Types.ObjectId(), // Replace with actual user ID
        company: createdCompanies[0]._id,
        communication: createdCommunications[0]._id,
        type: "due today",
        message: "Reminder: Send a newsletter to Alpha Tech.",
      },
      {
        user: new mongoose.Types.ObjectId(), // Replace with actual user ID
        company: createdCompanies[1]._id,
        communication: createdCommunications[1]._id,
        type: "overdue",
        message: "Overdue: Social Media Outreach for Beta Innovations.",
      },
    ];

    await Notification.insertMany(notifications);

    console.log("\n\nSeed data added successfully!✅\n\n");
  } catch (error) {
    console.error("\n\nError seeding data:❌\n\n", error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
