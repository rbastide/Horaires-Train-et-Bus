function updateDateTime() {
            const now = new Date();
            const time = now.toLocaleTimeString('fr-FR');
            document.getElementById('datetime').innerHTML = '<p> Heure : '  + time + '</p>';
        }

        document.addEventListener('DOMContentLoaded', function(){
            setInterval(updateDateTime, 1000);
            updateDateTime();
        })