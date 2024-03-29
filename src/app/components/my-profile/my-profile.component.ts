import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AppConstants } from 'src/app/constants/app-constants';
import { PaymentService } from 'src/app/services/payment.service';
import { UserPayment } from 'src/app/models/user-payment';
import { UserBilling } from 'src/app/models/user-billing';
import { UserShipping } from 'src/app/models/user-shipping';
import { ShippingService } from 'src/app/services/shipping.service';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
	selector: 'app-my-profile',
	templateUrl: './my-profile.component.html',
	styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

	private serverPath = AppConstants.serverPath;
	private dataFetched = true;
	private loginError: boolean;
	private loggedIn: boolean;
	private credential = { 'username': '', 'password': '' };

	private user: User = new User();
	private updateSuccess: boolean;
	private newPassword: string;
	private incorrectPassword: boolean;
	private currentPassword: string;

	private selectedProfileTab: number = 0;
	private selectedBillingTab: number = 0;
	private selectedShippingTab: number = 0;

	private userPayment: UserPayment = new UserPayment();
	private userBilling: UserBilling = new UserBilling();
	private userPaymentList: UserPayment[] = [];
	private defaultPaymentSet: boolean;
	private defaultUserPaymentId: number;
	private stateList: string[] = [];

	private userShipping: UserShipping = new UserShipping();
	private userShippingList: UserShipping[] = [];

	private defaultUserShippingId: number;
	private defaultShippingSet: boolean;

	private orderList: Order[] = [];
	private order: Order = new Order();
	private displayOrderDetail: boolean;

	constructor(
		private loginService: LoginService,
		private userService: UserService,
		private paymentService: PaymentService,
		private shippingService: ShippingService,
		private orderService: OrderService,
		private router: Router
	) { }

	selectedShippingChange(val: number) {
		this.selectedShippingTab = val;
	}

	selectedBillingChange(val: number) {
		this.selectedBillingTab = val;
	}

	onUpdateUserInfo() {
		this.userService.updateUserInfo(this.user, this.newPassword, this.currentPassword).subscribe(
			res => {
				console.log(res);
				this.updateSuccess = true;
			},
			error => {
				console.log(error.text());
				let errorMessage = error.text();
				if (errorMessage === "Incorrect current password!") this.incorrectPassword = true;
			}
		);
	}

	getCurrentUser() {
		this.userService.getCurrentUser().subscribe(
			res => {
				//this.user = res.json();
				this.user = res;
				this.userPaymentList = this.user.userPaymentList;
				this.userShippingList = this.user.userShippingList;

				for (let index in this.userPaymentList) {
					if (this.userPaymentList[index].defaultPayment) {
						this.defaultUserPaymentId = this.userPaymentList[index].id;
						break;
					}
				}

				for (let index in this.userShippingList) {
					if (this.userShippingList[index].userShippingDefault) {
						this.defaultUserShippingId = this.userShippingList[index].id;
						break;
					}
				}

				this.dataFetched = true;
			},
			err => {
				console.log(err);
			}
		);
	}


	onNewPayment() {
		this.paymentService.newPayment(this.userPayment).subscribe(
			res => {
				this.getCurrentUser();
				this.selectedBillingTab = 0;
				this.userPayment = new UserPayment();
			},
			error => {
				console.log(error.text());
			}
		);
	}

	onUpdatePayment(payment: UserPayment) {
		this.userPayment = payment;
		this.userBilling = payment.userBilling;
		this.selectedBillingTab = 1;
	}

	onRemovePayment(id: number) {
		this.paymentService.removePayment(id).subscribe(
			res => {
				this.getCurrentUser();
			},
			error => {
				console.log(error.text());
			}
		);
	}

	setDefaultPayment() {
		this.defaultPaymentSet = false;
		this.paymentService.setDefaultPayment(this.defaultUserPaymentId).subscribe(
			res => {
				this.getCurrentUser();
				this.defaultPaymentSet = true;
			},
			error => {
				console.log(error.text());
			}
		);
	}

	onNewShipping() {
		this.shippingService.newShipping(this.userShipping).subscribe(
			res => {
				this.getCurrentUser();
				this.selectedShippingTab = 0;
				this.userShipping = new UserShipping();
			},
			error => {
				console.log(error.text());
			}
		);
	}

	onUpdateShipping(shipping: UserShipping) {
		this.userShipping = shipping;
		this.selectedShippingTab = 1;
	}

	onRemoveShipping(id: number) {
		this.shippingService.removeShipping(id).subscribe(
			res => {
				this.getCurrentUser();
			},
			error => {
				console.log(error.text());
			}
		);
	}

	setDefaultShipping() {
		this.defaultShippingSet = false;
		this.shippingService.setDefaultShipping(this.defaultUserShippingId).subscribe(
			res => {
				this.getCurrentUser();
				this.defaultShippingSet = true;
			},
			error => {
				console.log(error.text());
			}
		);
	}

	onDisplayOrder(order: Order) {
		console.log(order);
		this.order=order;
		this.displayOrderDetail=true;
	  }

	ngOnInit() {
		// this.loginService.checkSession().subscribe(
		// 	res => {
		// 		this.loggedIn = true;
		// 	},
		// 	error => {
		// 		this.loggedIn = false;
		// 		console.log("inactive session");
		// 		this.router.navigate(['/myAccount']);
		// 	}
		// );

		this.getCurrentUser();

		for (let s in AppConstants.usStates) {
			this.stateList.push(s);
		}

		this.userBilling.userBillingState = "";
		this.userPayment.type = "";
		this.userPayment.expiryMonth = "";
		this.userPayment.expiryYear = "";
		this.userPayment.userBilling = this.userBilling;
		this.defaultPaymentSet = false;

		this.userShipping.userShippingState = "";
		this.defaultShippingSet = false;
	}

}
