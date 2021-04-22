/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
use ape

var newAdmin = db.user.findOne(
{ "email": { $eq: "email@email.mail" } }
);

db.user.updateOne(
	newAdmin,
	{ $set: { status: "Approved" } }
);

db.userApproveRequest.updateOne(
	{ userId: newAdmin._id },
	{ $set: { status: "Approved" } }
);

db.userAdmin.insertOne(
	{ userId: newAdmin._id, adminStatus: "Active" }
);