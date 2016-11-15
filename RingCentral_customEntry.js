//URL that you set in RingCentral softphone looks like https://system.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=547&deploy=1&custpage_phone=%P

function RingCentral_customerEntry(request, response){
	var context = nlapiGetContext();
	nlapiLogExecution('DEBUG','RingCentral customer Entry', 'start ' + context.getRemainingUsage());
	
	if (request.getMethod() == 'GET') {					
		
		var phone = request.getParameter('custpage_phone');
		var form_SS = nlapiCreateForm('Customer Entry');
		
		if ((phone != null) && (phone != '')) { 
			var filters = new Array();
			filters[0] = new nlobjSearchFilter('phone', null, 'is', phone);		// change search operator from equals to is
			var columns = new Array();
			columns[0] = new nlobjSearchColumn('entityId');
			var searchResults = nlapiSearchRecord('customer', null, filters, columns);
        
	         if (searchResults == null || searchResults.length == 0) { // Customer record not found, redirect to edit page 
	              nlapiLogExecution('DEBUG','RingCentral 1', 'GET Search Result 0 ');
	              nlapiSetRedirectURL('RECORD','customer', null, null,null);	
	         } else if (searchResults.length == 1) { 
	        	 nlapiLogExecution('DEBUG','RingCentral 1', 'GET Search Result 1 ');
	         	 var entityId = searchResults[0].getId();
	             nlapiSetRedirectURL( 'RECORD', 'customer', entityId, false );
	         } else if (searchResults.length > 1) { 
	        	 nlapiLogExecution('DEBUG','RingCentral 1', 'GET Search Result more ');
	        	 	        
	        	 var phoneList = form_SS.addSubList('custpage_list','list','Test');
	        	 phoneList.addField('custpage_entityid','text','Customer');
	        	 phoneList.addField('custpage_urlview','url','View').setLinkText('View');
	        	 phoneList.addField('custpage_urledit','url','Edit').setLinkText('Edit');
	        	 for (var iLP=0; iLP<searchResults.length; iLP++) {
	        		 var viewURL = nlapiResolveURL('RECORD','customer',searchResults[iLP].getId(), 'VIEW');
	        		 var editURL = nlapiResolveURL('RECORD','customer',searchResults[iLP].getId(), 'EDIT');	
	        		 
	        		 phoneList.setLineItemValue('custpage_entityid',iLP+1,searchResults[iLP].getValue('entityId'));
	        		 phoneList.setLineItemValue('custpage_urlview',iLP+1,viewURL);
	        		 phoneList.setLineItemValue('custpage_urledit',iLP+1,editURL);
	        	 }
	        	 
//				 This would also work but not as customable as above	        	 
//	        	 phoneList.addField('entityid','text','Customer');
//	        	 phoneList.setLineItemValues(searchResults);
	        	         	 
	         }
		}
	         
		form_SS.addSubmitButton('Test');
		response.writePage(form_SS);
	} else {
		nlapiLogExecution('DEBUG','RingCentral customer Entry', 'POST');		
	}
}
