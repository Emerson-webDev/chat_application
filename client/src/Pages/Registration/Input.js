export const inputs = [
  {
    label: "First Name",
    name: "first_name",
    type: "text",
    size: "small",
    placeholder: "Firstname",
    required: true,
  },
  {
    label: "Last Name",
    name: "last_name",
    type: "text",
    size: "small",
    placeholder: "Lastname",
    required: true,
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    errormessage:
      "Please input temporary email. *ex. end in gmail.com, yahoo.com",
    pattern: "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$",
    size: "small",
    placeholder: "Email",
    required: true,
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    errormessage:
      "Password should be 8-20 characters. Atleast 1 uppercase,1 lowercase, 1 number and 1 special character",
    // error: values.errorMsg.password,
    pattern:
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\\-]).{9,20}$",
    size: "small",
    placeholder: "Password",
    required: true,
  },
  {
    label: "Confirm password",
    name: "confirm_password",
    type: "password",
    errormessage: "Password does not match please check the input",
    // error: values.errorMsg.cpassword,
    size: "small",
    placeholder: "Confirm password",
    required: true,
  },
];
