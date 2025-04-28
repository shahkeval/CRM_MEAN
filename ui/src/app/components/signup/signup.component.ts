// import { Component, OnInit } from "@angular/core";
// import {
//   FormControl,
//   FormBuilder,
//   FormGroup,
//   Validators,
// } from "@angular/forms";
// import { UserManagementService } from "../../services/user_management/user-management.service";
// import { Router } from "@angular/router";
// import { ToastMessageService } from "../../services/toast_message/toast-message.service";
// import { MustMatch } from "../../helpers/validation_functions";

// @Component({
//   selector: "app-signup",
//   templateUrl: "./signup.component.html",
//   styleUrls: ["./signup.component.scss"],
// })
// export class SignupComponent implements OnInit {
//   signupForm: FormGroup;
//   submitted: boolean = false;
//   errorMessage: string;

//   constructor(
//     private formBuilder: FormBuilder,
//     private userService: UserManagementService,
//     private router: Router,
//     private toastMessage: ToastMessageService
//   ) {}

//   ngOnInit() {
//     this.signupForm = this.formBuilder.group(
//       {
//         name: new FormControl("", [Validators.required]),
//         username: new FormControl("", [Validators.required]),
//         password: new FormControl("", [
//           Validators.required,
//           Validators.minLength(6),
//         ]),
//         confirmPassword: new FormControl("", [Validators.required]),
//         email: new FormControl("", [Validators.required, Validators.email]),
//         phone: new FormControl("", [
//           Validators.required,
//           Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
//         ]),
//       },
//       {
//         validators: MustMatch("password", "confirmPassword"),
//       }
//     );
//   }

//   get signupFormControl() {
//     return this.signupForm.controls;
//   }

//   onSubmit(form: FormGroup) {
//     this.submitted = true;
    
//     // Collect user info including the plain password
//     let userInfo = {
//       name: form.value.name,
//       username: form.value.username,
//       password: form.value.password, // Plain password
//       email: form.value.email,
//       phone: form.value.phone,
//       isAdmin: false,
//       isActive: true,
//     };

//     // Send the user information to the backend for processing
//     this.userService.createUser(userInfo).subscribe(
//       (res) => {
//         console.log(res);
//         this.router.navigateByUrl("/signin");
//       },
//       (err) => {
//         this.errorMessage = err.error["message"].message;
//         this.toastMessage.showError(this.errorMessage);
//       }
//     );
//   }
// }

import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { UserManagementService } from "../../services/user_management/user-management.service";
import { Router } from "@angular/router";
import { ToastMessageService } from "../../services/toast_message/toast-message.service";
import { MustMatch } from "../../helpers/validation_functions";
import * as CryptoJS from "crypto-js"; // Import CryptoJS

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitted: boolean = false;
  errorMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserManagementService,
    private router: Router,
    private toastMessage: ToastMessageService
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group(
      {
        name: new FormControl("", [Validators.required]),
        username: new FormControl("", [Validators.required]),
        password: new FormControl("", [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmPassword: new FormControl("", [Validators.required]),
        email: new FormControl("", [Validators.required, Validators.email]),
        phone: new FormControl("", [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
        ]),
      },
      {
        validators: MustMatch("password", "confirmPassword"),
      }
    );
  }

  get signupFormControl() {
    return this.signupForm.controls;
  }

  onSubmit(form: FormGroup) {
    this.submitted = true;

    // Hash the password using SHA-256
    const hashedPassword = CryptoJS.SHA256(form.value.password).toString();

    // Collect user info, replacing the plain password with the hashed password
    let userInfo = {
      name: form.value.name,
      username: form.value.username,
      password: hashedPassword, // Hashed password
      email: form.value.email,
      phone: form.value.phone,
      isAdmin: false,
      isActive: true,
    };

    // Send the user information to the backend for processing
    this.userService.createUser(userInfo).subscribe(
      (res) => {
        console.log(res);
        this.router.navigateByUrl("/signin");
      },
      (err) => {
        this.errorMessage = err.error["message"].message;
        this.toastMessage.showError(this.errorMessage);
      }
    );
  }
}
