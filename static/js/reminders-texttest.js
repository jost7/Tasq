document.addEventListener('DOMContentLoaded', () => {
    if (!('Notification' in window)) {
        alert('This browser does not support notifications.');
    } else if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
});

document.getElementById('reminderForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const message = document.getElementById('message').value;
    const sendAt = new Date(document.getElementById('sendAt').value);

    const reminder = {
        id: Date.now(),
        title: title,
        message: message,
        sendAt: sendAt.toISOString()
    };

    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders.push(reminder);
    localStorage.setItem('reminders', JSON.stringify(reminders));

    scheduleReminder(reminder);
    document.getElementById('reminderForm').reset();
});

function scheduleReminder(reminder) {
    const now = new Date();
    const sendAt = new Date(reminder.sendAt);
    const delay = sendAt.getTime() - now.getTime();

    if (delay > 0) {
        setTimeout(() => {
            showNotification(reminder.title, reminder.message);
            removeReminder(reminder.id);
        }, delay);
    } else {
        removeReminder(reminder.id);
    }
}

function showNotification(title, message) {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, { body: message });
        setTimeout(() => {
            notification.close();
        }, 5000);
    }
}

function removeReminder(id) {
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders = reminders.filter(reminder => reminder.id !== id);
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

function initReminders() {
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders.forEach(reminder => {
        scheduleReminder(reminder);
    });
}

document.addEventListener('DOMContentLoaded', initReminders);
