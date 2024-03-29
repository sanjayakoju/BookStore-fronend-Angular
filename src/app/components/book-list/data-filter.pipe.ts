import { PipeTransform, Pipe } from '@angular/core';


@Pipe({
	name:"dataFilter"
})
export class DataFilterPipe implements PipeTransform {
	transform(array: any[], query: string) : any {
		if(query) {
			return _.filter(array, row=> row.description.indexOf(query) > -1);
		}
		return array;
	}
}