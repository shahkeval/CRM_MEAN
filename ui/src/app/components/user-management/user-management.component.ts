import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { User } from "../../interfaces/user";
import { UserManagementService } from "../../services/user_management/user-management.service";
import { DatetimeService } from "../../services/datetime/datetime.service";

@Component({
  selector: "app-user-management",
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.scss"],
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = [
    "name",
    "email",
    "isAdmin",
    "isActive",
    "createdTime",
    "modify",
  ];
  dataSource: User[] = [];
  users$: Observable<User[]>;

  constructor(
    private router: Router,
    private userService: UserManagementService,
    protected datetimeService: DatetimeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.users$ = this.userService.getUsers();

    const draft = window.localStorage.getItem("user");
    if (draft) {
      this.router.navigateByUrl("/user_management/add");
    }
  }

  deleteUser(userId: string) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.snackBar.open("User deleted successfully", "Close", {
            duration: 3000,
          });
          this.loadUsers(); // Reload users after deletion
        },
        (error) => {
          this.snackBar.open("Error deleting user", "Close", {
            duration: 3000,
          });
          console.error("Error deleting user:", error);
        }
      );
    }
  }

  loadUsers() {
    this.users$ = this.userService.getUsers();
  }

  // navigate to the edit sale order page
  navigateToEdit(userId: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: { id: userId },
    };
    this.router.navigate(["/user_management/edit"], navigationExtras);
  }


  
}
