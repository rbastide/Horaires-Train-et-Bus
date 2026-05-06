function updateDateTime() {
            const dateTimeElement = document.getElementById('datetime');

            if (!dateTimeElement) return;

            const now = new Date();
            const time = now.toLocaleTimeString('fr-FR');
            document.getElementById('datetime').innerHTML = time;
        }

document.addEventListener('DOMContentLoaded', function(){

    const interval = setInterval(() => {
        if (document.getElementById('datetime')){
            updateDateTime();
            setInterval(updateDateTime, 1000);
            clearInterval(interval);
        }
    },100);
            
});