import { LightningElement } from 'lwc';
 // imports
import { NavigationMixin } from 'lightning/navigation';
 
export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false;
  
    // Handles loading event
    handleLoading(){
        this.isLoading = true;
        //console.log('Boat Srch handleLoading - ', this.isLoading);
    }
    
    // Handles done loading event
    handleDoneLoading(){
        this.isLoading = false;
        //console.log('Boat Srch handleDoneLoading - ', this.isLoading);
    }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) { 
        //console.log('Selected Boat in BoatSearch -', event.detail.boatTypeId);
        const boatTypeId = event.detail.boatTypeId;
        this.template.querySelector("c-boat-search-results").searchBoats(boatTypeId);
    }
    
    createNewBoat(){
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c',
                actionName: 'new'
            }
        });
    }
}