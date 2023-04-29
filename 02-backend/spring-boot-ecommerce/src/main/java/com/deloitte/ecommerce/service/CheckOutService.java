package com.deloitte.ecommerce.service;

import com.deloitte.ecommerce.dto.Purchase;
import com.deloitte.ecommerce.dto.PurchaseResponse;

public interface CheckOutService {

	PurchaseResponse placeOrder(Purchase purchase);
}
