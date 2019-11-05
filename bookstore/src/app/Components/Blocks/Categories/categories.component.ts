import{ Component } from '@angular/core';
import { CategoryService } from 'src/app/Services/category.module';

@Component({
    templateUrl: 'categories.component.html',
    selector: 'categories',
    providers: [CategoryService]
})

export class CategoriesComponent{
    arrCate:any = []
    constructor(private cateService:CategoryService){
        cateService.getCategory().subscribe(data =>{
            console.log(data);
            this.arrCate = data;
        });
    }
}