import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormGroup, Validators, FormControl, FormBuilder} from "@angular/forms";
import {ProductState} from "../../../../share/states/product/product.state";
import {IohProductCategoryModel} from "../../../../share/model/product/ioh-product-category.model";
import {IohProductTypeModel} from "../../../../share/model/product/ioh-product-type.model";

@Component({
  selector: 'app-create-product-modal',
  templateUrl: './create-product-modal.component.html',
  styleUrls: ['./create-product-modal.component.scss']
})
export class CreateProductModalComponent implements OnInit {
  productForm: any;
  listProductCategory: IohProductCategoryModel[] = [];
  listProductType: IohProductTypeModel[] = [];
  listFileImage: any = [];

  constructor(private modal: NgbActiveModal,
              private formBuilder: FormBuilder,
              private productState: ProductState) { }

  ngOnInit(): void {
    this.listenState();
    this.initFormProduct();
  }
  listenState(): void{
    this.productState.$listCategory.subscribe(res => this.listCategoryChange())
    this.productState.$listProductType.subscribe(res => this.listProductTypeChange())
  }
  listCategoryChange(): void{
    const listCategory = this.productState.getProductCategory();
    if(listCategory){
      this.listProductCategory = listCategory;
      console.log(this.listProductCategory);
    }
  }
  listProductTypeChange(): void{
    const listProductType = this.productState.getProductType();
    if(listProductType){
      this.listProductType = listProductType;
      console.log(this.listProductType);
    }
  }

  onFileSelected(event: any, fileName: String): void{
    const file = (event.target.files[0] as File);
    this.productForm.get(fileName).setValue(file);
  }

  initFormProduct(): void{
    this.productForm = this.formBuilder.group({
      productName: new FormControl('', Validators.required),
      priceValue: new FormControl('', Validators.required),
      discount: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      imageThumbnailSource: new FormControl(null, Validators.required),
      imageThumbnail: [null],
      productCategory: new FormControl('', Validators.required),
      productType: new FormControl('', Validators.required),
      imageSource1: new FormControl(null, Validators.required),
      imageSource2: new FormControl(null, Validators.required),
      imageSource3: new FormControl(null, Validators.required),
      imageSource4: new FormControl(null, Validators.required),
      imageSource5: new FormControl(null, Validators.required),
      imageSource6: new FormControl(null, Validators.required),
      image1: [null],
      image2: [null],
      image3: [null],
      image4: [null],
      image5: [null],
      image6: [null],
    })
  }

  cancel() {
    this.modal.close();
  }
  isControlValid(formGroup: FormGroup, controlName: string): boolean {
    const control = formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(formGroup: FormGroup, controlName: string): boolean {
    const control = formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(formGroup: FormGroup, validation: any, controlName: any): boolean {
    const control = formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(formGroup: FormGroup, controlName: any): boolean {
    const control = formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
  pushToListImage(): void{
    this.listFileImage.push(this.productForm.get('image1').value);
    this.listFileImage.push(this.productForm.get('image2').value);
    this.listFileImage.push(this.productForm.get('image3').value);
    this.listFileImage.push(this.productForm.get('image4').value);
    this.listFileImage.push(this.productForm.get('image5').value);
    this.listFileImage.push(this.productForm.get('image6').value);
  }
  submit(): void{
    this.pushToListImage();
    const fd: any  = new FormData();
    fd.append('product_name',this.productForm.get('productName').value);
    fd.append('price_value', this.productForm.get('priceValue').value);
    fd.append('discount', this.productForm.get('discount').value);
    fd.append('description', this.productForm.get('description').value);
    fd.append('image_thumbnail', this.productForm.get('imageThumbnail').value);
    fd.append('product_category_id', this.productForm.get('productCategory').value.productCategoryId);
    fd.append('product_type_id', this.productForm.get('productType').value.productTypeId);
    fd.append('images', this.productForm.get('image1').value);
    fd.append('images', this.productForm.get('image2').value);
    fd.append('images', this.productForm.get('image3').value);
    fd.append('images', this.productForm.get('image4').value);
    fd.append('images', this.productForm.get('image5').value);
    fd.append('images', this.productForm.get('image6').value);
    console.log(this.listFileImage);

    this.productState.createProduct(fd).subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.log(error);
      }
    )
    console.log(this.productForm.getRawValue())
  }
}