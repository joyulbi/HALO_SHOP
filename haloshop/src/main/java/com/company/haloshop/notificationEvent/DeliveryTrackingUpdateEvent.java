package com.company.haloshop.notificationEvent;

import org.springframework.context.ApplicationEvent;
import com.company.haloshop.dto.shop.DeliveryTrackingDTO;

public class DeliveryTrackingUpdateEvent extends ApplicationEvent {

    private final DeliveryTrackingDTO deliveryTrackingDTO;

    public DeliveryTrackingUpdateEvent(Object source, DeliveryTrackingDTO deliveryTrackingDTO) {
        super(source);
        this.deliveryTrackingDTO = deliveryTrackingDTO;
    }

    public DeliveryTrackingDTO getDeliveryTrackingDTO() {
        return deliveryTrackingDTO;
    }
}