import { LightningElement, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { APPLICATION_SCOPE, subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
//import { refreshApex } from '@salesforce/apex';
// Custom Labels Imports
// import labelDetails for Details
// import labelReviews for Reviews
// import labelAddReview for Add_Review
// import labelFullDetails for Full_Details
// import labelPleaseSelectABoat for Please_select_a_boat
import labelDetails from '@salesforce/label/c.Details';
import labelReviews from '@salesforce/label/c.Reviews';
import labelAddReview from '@salesforce/label/c.Add_Review';
import labelFullDetails from '@salesforce/label/c.Full_Details';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';

// Boat__c Schema Imports
// import BOAT_ID_FIELD for the Boat Id
// import BOAT_NAME_FIELD for the boat Name
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
//const BOAT_ID_FIELD = 'Boat__c.Id';
//const BOAT_NAME_FIELD = 'Boat__c.Name';
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';
const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];

import BOAT_TYPE_FIELD from '@salesforce/schema/Boat__c.BoatType__c';
import BOAT_LENGTH_FIELD from '@salesforce/schema/Boat__c.Length__c';
import BOAT_PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';
import BOAT_DESCRIPTION_FIELD from '@salesforce/schema/Boat__c.Description__c';

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
    @api boatId;
    wiredRecord;
    error;

    label = {
      labelDetails,
      labelReviews,
      labelAddReview,
      labelFullDetails,
      labelPleaseSelectABoat,
    };

    @wire(MessageContext) messageContext;

    @wire(getRecord,{
        recordId:'$boatId',
        fields: BOAT_FIELDS
    })
    wiredRecord;

    // Decide when to show or hide the icon
    // returns 'utility:anchor' or null
    get detailsTabIconName() {
        return this.wiredRecord && this.wiredRecord.data ? 'utility:anchor' : null;
    }
    
    // Utilize getFieldValue to extract the boat name from the record wire
    get boatName() {
        return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
    }
    
    // Private
    subscription = null;
    
    // Subscribe to the message channel
    subscribeMC() {
      // local boatId must receive the recordId from the message
      if (this.subscription) {
        return;
      }
      // Subscribe to the message channel to retrieve the recordID and assign it to boatId.
      if (!this.subscription) {
        this.subscription = subscribe(this.messageContext,BOATMC, (message) => {
            this.boatId = message.recordId;
          }, { scope: APPLICATION_SCOPE });
      }
    }
    
    // Calls subscribeMC()
    connectedCallback() {
        this.subscribeMC();
    }
    
    // Navigates to record page
    navigateToRecordViewPage() {
        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                recordId: this.boatId,
                actionName: "view"
            }
        });
    }
    
    // Navigates back to the review list, and refreshes reviews component
    handleReviewCreated() {
        this.template.querySelector('lightning-tabset').activeTabValue = 'reviews';
        this.template.querySelector('c-boat-reviews').refresh();
    }
}