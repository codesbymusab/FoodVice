const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const d = new Date()

exports.openingTime=(openingHours)=>{
    const opening=openingHours.find((oh) => oh.day === days[d.getDay()])
    
    if(opening){
        return opening.hours.split('to')[0]
    }
}
