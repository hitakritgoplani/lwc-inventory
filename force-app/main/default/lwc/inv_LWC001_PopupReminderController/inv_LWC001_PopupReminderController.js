import { LightningElement, track, wire } from 'lwc';
import getMyReminders from '@salesforce/apex/INV_AX001_PopupReminderController.getMyReminders';
import markReminderAsCompleted from '@salesforce/apex/INV_AX001_PopupReminderController.markReminderAsCompleted';

export default class Inv_LWC001_PopupReminderController extends LightningElement {
    @track reminders = [];

    @wire(getMyReminders)
    wiredReminders({ data, error }) {
        if (data) {
            this.reminders = data.map(reminder => ({
                ...reminder,
                toastClass: `toast ${reminder.INV_Priority__c}`,
                formattedTime: this.formatTime(reminder.INV_ReminderDateTime__c)
            }));
        } else if (error) {
            console.error('Error fetching reminders: ', error);
        }
    }

    handleClose(event) {
        const reminderId = event.target.dataset.id;
        this.reminders = this.reminders.filter(reminder => reminder.Id !== reminderId);
        this.markCompletedAsync(reminderId);
    }

    async markCompletedAsync(reminderId) {
        try {
            await markReminderAsCompleted({ reminderId });
            console.log(`Reminder ${reminderId} marked as completed`);
        } catch (error) {
            console.error(`Error marking reminder ${reminderId} as completed: `, error);
        }
    }

    formatTime(dateTimeStr) {
        if (!dateTimeStr) return '';
        const date = new Date(dateTimeStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
}
