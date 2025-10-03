public with sharing class INV_AX001_PopupReminderController {
    @AuraEnabled(cacheable=true)
    public static List<INV_CO_Reminder__c> getMyReminders() {
        return [
            SELECT Id, Name, INV_Priority__c, INV_ReminderDateTime__c
            FROM INV_CO_Reminder__c
            WHERE OwnerId = :UserInfo.getUserId() 
            AND INV_CompletionStatus__c = false
            AND INV_ReminderDateTime__c >= :DateTime.now()
            AND INV_ReminderDateTime__c <= :DateTime.now().addMinutes(30)
            ORDER BY INV_ReminderDateTime__c ASC
        ];
    }

    @AuraEnabled
    public static void markReminderAsCompleted(Id reminderId) {
        INV_CO_Reminder__c reminder = [SELECT Id, INV_CompletionStatus__c FROM INV_CO_Reminder__c WHERE Id = :reminderId LIMIT 1];
        if(reminder != null) {
            reminder.INV_CompletionStatus__c = true;
            update reminder;
        }
    }
}
