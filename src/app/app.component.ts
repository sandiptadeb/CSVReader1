import { Component, ViewChild } from '@angular/core';  
  
@Component({  
  selector: 'app-root',  
  templateUrl: './app.component.html',  
  styleUrls: ['./app.component.css']  
})  
  
export class AppComponent {    
  
  public records: any[] = [];  
  public headersRow: any[] = [];  
  @ViewChild('csvReader',{static: false}) csvReader: any;  
  
  uploadListener($event: any): void {  
  
    let text = [];  
    let files = $event.srcElement.files;  
  
    if (this.isValidCSVFile(files[0])) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
         this.headersRow = this.getHeaderArray(csvRecordsArray); 
         if(!this.isValidHeaderCSV(this.headersRow)){
           alert("CSV file doesn't contain the desired column headers");
           this.fileReset(); 
           return;
         } 
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);  
      };  
  
      reader.onerror = function () {  
        console.log('error has occured while reading file!');  
      };  
  
    } else {  
      alert("Please import valid .csv file.");  
      this.fileReset();  
    }  
  }  
  
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any) {  
    let csvArr = [];  
  
    let currentHeader = this.headersRow;
    for (let i = 1; i < csvRecordsArray.length; i++) {  
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');  //assuming it to be ',' as only delimitter
      if (curruntRecord.length == currentHeader.length) {  
        let csvRecord = {};  
        for(let ii = 0; ii < currentHeader.length; ii++){
          csvRecord[currentHeader[ii]] = curruntRecord[ii].trim(); 
        }
        csvArr.push(csvRecord);  
      }  
    }  
    return csvArr;  
  }  
  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }  
  
  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(',');  //assuming it to be ',' as only delimitter
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  }  
  
  fileReset() {  
    this.csvReader.nativeElement.value = "";  
    this.records = [];  
  }  

  isValidHeaderCSV(headerArray){
    //hardcoding the header texts as not sure what all other header I need to check and how to obtain them
    if(headerArray.includes("PROD")  &&  
    headerArray.includes("CUST") && 
    headerArray.includes("PERIOD") && 
    headerArray.includes("QUANTITY"))
      return true;
    return false;
  }
}  