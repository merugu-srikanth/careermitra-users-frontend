# User Profile API Documentation

This document describes the backend API contract required by `src/pages/Userprofilefillingpage.jsx`.

The React component builds a payload with two top-level objects:

```json
{
  "profile": {},
  "education": {}
}
```

The current frontend submits this payload with an authenticated request to the profile endpoint.

## Endpoint

### Create Or Update User Profile

`POST /api/profile`

Use this endpoint when the user completes the profile filling form after registration.

Recommended behavior:

- If the user does not have a profile, create one.
- If the user already has a profile, update the existing record.
- Use the authenticated user from the JWT token instead of trusting a `user_id` from the request body.

## Authentication

The frontend sends a Bearer token.

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
```

Backend should reject requests without a valid token.

Recommended response:

```json
{
  "status": false,
  "message": "Unauthorized"
}
```

## Request Body

### Full Shape

```json
{
  "profile": {
    "name": "Ravi Kumar",
    "email": "ravi@example.com",
    "phone": "9876543210",
    "gender": "male",
    "date_of_birth": "2000-05-20",
    "state": "Telangana",
    "district": "Hyderabad",
    "current_location": "Hyderabad",
    "current_status": "student",
    "physically_challenged": "No",
    "highest_education_institution_type": "government",
    "social_status": "BC-B",
    "additional_support": "All of the above",
    "how_did_you_come_across_career_mitra": "WhatsApp",
    "how_did_you_come_across_career_mitra_other": null,
    "alert_job": true,
    "alert_internship": true,
    "alert_both": true,
    "notification_preference": "email",
    "notify": true,
    "has_technical_certification": "yes",
    "technical_certification_details": "Python, Tally",
    "any_other_certification_from_board_of_education": null,
    "qualified_teacher_exam": false,
    "preferences": ["Civil Services", "CGL", "SBI Clerk"]
  },
  "education": {
    "qualification_level": "graduation",
    "below10th_details": null,
    "below10th_schoolname": null,
    "10th_board": null,
    "10th_schoolname": null,
    "intermediate_course": "MPC",
    "intermediate_course_other": null,
    "intermediate_board": "Telangana State Board",
    "intermediate_vocational_subject": null,
    "intermediate_college_name": "ABC Junior College, Hyderabad",
    "intermediate_current_year": "Completed",
    "iti_trade": null,
    "iti_trade_other": null,
    "iti_college_name": null,
    "iti_current_year": null,
    "polytechnic_branch": null,
    "polytechnic_college_name": null,
    "polytechnic_current_year": null,
    "diploma_branch": null,
    "diploma_current_year": null,
    "graduation_type": "regular",
    "graduation_course": "B.Sc.",
    "graduation_course_other": null,
    "graduation_subject1": "Mathematics",
    "graduation_subject2": "Physics",
    "graduation_subject3": "Computer Science",
    "graduation_specialization": null,
    "graduation_college_name": "XYZ Degree College, Hyderabad",
    "graduation_current_year": "3rd Year",
    "graduation_qualified_in": null,
    "qualified_teacher_exam": 0,
    "second_graduation_type": null,
    "second_graduation_course": null,
    "second_graduation_course_other": null,
    "second_graduation_subject1": null,
    "second_graduation_subject2": null,
    "second_graduation_subject3": null,
    "second_graduation_specialization": null,
    "second_graduation_college_name": null,
    "second_graduation_current_year": null,
    "second_graduation_qualified_in": null,
    "post_graduation_course": null,
    "post_graduation_course_other": null,
    "post_graduation_specialization": null,
    "pg_subject1": null,
    "pg_subject2": null,
    "pg_subject3": null,
    "pg_college_name": null,
    "pg_current_year": null,
    "second_post_graduation_course": null,
    "second_post_graduation_course_other": null,
    "second_post_graduation_specialization": null,
    "second_pg_subject1": null,
    "second_pg_subject2": null,
    "second_pg_subject3": null,
    "second_pg_college_name": null,
    "second_pg_current_year": null,
    "phd_research_field": null,
    "phd_university": null,
    "phd_university_name": null,
    "phd_current_year": null,
    "other_course_code": null,
    "other_course_specialization": null,
    "other_course_full_name": null,
    "other_education_full_name": null,
    "other_education_current_year": null
  }
}
```

## Profile Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | Yes | Full name. |
| `email` | string | Yes | Should usually match authenticated user email. |
| `phone` | string | Yes | Minimum 10 digits recommended. |
| `gender` | string | Yes | Frontend sends lowercase value, for example `male`, `female`, `other`. |
| `date_of_birth` | string | Yes | Format: `YYYY-MM-DD`. User must be at least 18 years old. |
| `state` | string | Yes | Indian state name from `country-state-city`. |
| `district` | string | Yes | City/district selected after state. |
| `current_location` | string | Yes | User-entered current location. |
| `current_status` | string | Yes | User current status from form. |
| `physically_challenged` | string | No | Frontend sends `Yes` or `No`. |
| `highest_education_institution_type` | string | No | `government` or `Private` from current UI. |
| `social_status` | string | No | Example: `OC`, `SC`, `ST`, `BC-A`, `BC-B`, `Minority`. |
| `additional_support` | string | No | Counseling support preference. |
| `how_did_you_come_across_career_mitra` | string | No | Example: `LinkedIn`, `WhatsApp`, `Other`. |
| `how_did_you_come_across_career_mitra_other` | string/null | Conditional | Required only when source is `Other`. |
| `alert_job` | boolean | No | True when job alerts are selected. |
| `alert_internship` | boolean | No | True when internship alerts are selected. |
| `alert_both` | boolean | No | True when both alerts are selected. |
| `notification_preference` | string | No | Defaults to `email`. |
| `notify` | boolean | No | Defaults to `true`. |
| `has_technical_certification` | string | No | Frontend sends `yes` or `no`. |
| `technical_certification_details` | string/null | Conditional | Required only if `has_technical_certification` is `yes`. |
| `any_other_certification_from_board_of_education` | string/null | No | Certificate/diploma details. |
| `qualified_teacher_exam` | boolean | No | Profile-level boolean. |
| `preferences` | string[] | No | Maximum 3 exam preferences. |

## Education Fields

The frontend sends every education field, but unrelated fields are sent as `null`.

### Qualification Levels

| Frontend value | Backend `qualification_level` |
| --- | --- |
| `below-10th` | `below_10th` |
| `10th` | `10th` |
| `12th` | `intermediate` |
| `iti` | `iti` |
| `polytechnic` | `polytechnic` |
| `graduation` | `graduation` |
| `double-graduation` | `double_graduation` |
| `postgraduation` | `post_graduation` |
| `double-postgraduation` | `double_post_graduation` |
| `phd` | `phd` |
| `other-edu` | `other` |

### Conditional Rules

| Qualification | Backend should accept these related fields |
| --- | --- |
| `below_10th` | `below10th_details`, `below10th_schoolname` |
| `10th` | `10th_board`, `10th_schoolname` |
| `intermediate` | `intermediate_course`, `intermediate_course_other`, `intermediate_board`, `intermediate_vocational_subject`, `intermediate_college_name`, `intermediate_current_year` |
| `iti` | `iti_trade`, `iti_trade_other`, `iti_college_name`, `iti_current_year` |
| `polytechnic` | `polytechnic_branch`, `polytechnic_college_name`, `polytechnic_current_year` |
| `graduation` | Intermediate fields plus first graduation fields |
| `double_graduation` | Intermediate fields plus first and second graduation fields |
| `post_graduation` | Intermediate fields plus first graduation and first PG fields |
| `double_post_graduation` | Intermediate fields plus first graduation, first PG, and second PG fields |
| `phd` | Intermediate fields, first graduation fields, and PhD fields |
| `other` | `other_course_code`, `other_course_specialization`, `other_course_full_name`, `other_education_full_name`, `other_education_current_year` |

## Important Frontend Normalization

Backend should expect these frontend conventions:

- Empty strings are converted to `null`.
- `gender` is converted to lowercase.
- `physically_challenged` is normalized to `Yes` or `No`.
- Certification yes/no values are normalized to `yes` or `no`.
- Exam preferences are an array with maximum 3 items.
- If a preference contains `Others`, the frontend may replace it with user-entered custom text.
- Education fields unrelated to the selected qualification are sent as `null`.

## Validation Rules For Node.js

Minimum backend validation:

- `profile.name` is required.
- `profile.email` is required and must be a valid email.
- `profile.phone` is required and should be at least 10 digits.
- `profile.gender` is required.
- `profile.date_of_birth` is required and age must be 18 or above.
- `profile.state`, `profile.district`, `profile.current_location`, and `profile.current_status` are required.
- `education.qualification_level` is required.
- `profile.preferences` must be an array with maximum 3 items.
- If `profile.has_technical_certification` is `yes`, then `profile.technical_certification_details` should be required.
- If `profile.how_did_you_come_across_career_mitra` is `Other`, then `profile.how_did_you_come_across_career_mitra_other` should be required.
- Validate qualification-specific fields depending on `education.qualification_level`.

## Success Response

Recommended response:

```json
{
  "status": true,
  "message": "Profile saved successfully",
  "data": {
    "id": 12,
    "user_id": 45,
    "name": "Ravi Kumar",
    "email": "ravi@example.com",
    "education": {
      "qualification_level": "graduation"
    }
  }
}
```

## Validation Error Response

Recommended response:

```json
{
  "status": false,
  "message": "Validation failed",
  "errors": {
    "profile.name": "Name is required",
    "education.qualification_level": "Qualification level is required"
  }
}
```

## Node.js Express Example

```js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Profile = require("../models/Profile");
const Education = require("../models/Education");

const allowedQualificationLevels = new Set([
  "below_10th",
  "10th",
  "intermediate",
  "iti",
  "polytechnic",
  "graduation",
  "double_graduation",
  "post_graduation",
  "double_post_graduation",
  "phd",
  "other",
]);

function getAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age;
}

function validateProfilePayload(body) {
  const errors = {};
  const profile = body.profile || {};
  const education = body.education || {};

  if (!profile.name) errors["profile.name"] = "Name is required";
  if (!profile.email) errors["profile.email"] = "Email is required";
  if (!profile.phone || String(profile.phone).length < 10) {
    errors["profile.phone"] = "Valid phone number is required";
  }
  if (!profile.gender) errors["profile.gender"] = "Gender is required";
  if (!profile.date_of_birth) {
    errors["profile.date_of_birth"] = "Date of birth is required";
  } else if (getAge(profile.date_of_birth) < 18) {
    errors["profile.date_of_birth"] = "User must be at least 18 years old";
  }
  if (!profile.state) errors["profile.state"] = "State is required";
  if (!profile.district) errors["profile.district"] = "District is required";
  if (!profile.current_location) {
    errors["profile.current_location"] = "Current location is required";
  }
  if (!profile.current_status) {
    errors["profile.current_status"] = "Current status is required";
  }
  if (!education.qualification_level) {
    errors["education.qualification_level"] = "Qualification level is required";
  } else if (!allowedQualificationLevels.has(education.qualification_level)) {
    errors["education.qualification_level"] = "Invalid qualification level";
  }
  if (Array.isArray(profile.preferences) && profile.preferences.length > 3) {
    errors["profile.preferences"] = "Maximum 3 preferences are allowed";
  }
  if (
    profile.has_technical_certification === "yes" &&
    !profile.technical_certification_details
  ) {
    errors["profile.technical_certification_details"] =
      "Technical certification details are required";
  }
  if (
    profile.how_did_you_come_across_career_mitra === "Other" &&
    !profile.how_did_you_come_across_career_mitra_other
  ) {
    errors["profile.how_did_you_come_across_career_mitra_other"] =
      "Please specify how you found Career Mitra";
  }

  return errors;
}

router.post("/profile", authMiddleware, async (req, res) => {
  try {
    const errors = validateProfilePayload(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        status: false,
        message: "Validation failed",
        errors,
      });
    }

    const userId = req.user.id;
    const profilePayload = {
      ...req.body.profile,
      user_id: userId,
    };
    const educationPayload = {
      ...req.body.education,
      user_id: userId,
    };

    const profile = await Profile.findOneAndUpdate(
      { user_id: userId },
      profilePayload,
      { new: true, upsert: true, runValidators: true }
    );

    const education = await Education.findOneAndUpdate(
      { user_id: userId },
      educationPayload,
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      status: true,
      message: "Profile saved successfully",
      data: {
        ...profile.toObject(),
        education,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong while saving profile",
    });
  }
});

module.exports = router;
```

## Suggested Database Design

Recommended simple structure:

- `users` collection/table: authentication data like name, email, phone, password hash.
- `profiles` collection/table: personal profile, preferences, alerts, certifications.
- `educations` collection/table: education fields keyed by `user_id`.

The profile and education records should both be linked to the authenticated user.

## Frontend Integration Note

The current component uses:

```js
const API_PROFILE = "https://careermitra.in/api/public/api/profile";
```

For a local Node.js API, change this to an environment-based URL, for example:

```js
const API_PROFILE = `${import.meta.env.VITE_API_BASE_URL}/api/profile`;
```

Then define:

```env
VITE_API_BASE_URL=http://localhost:5000
```
