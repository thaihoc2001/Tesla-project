import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {catchError, finalize, tap} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {ProductService} from "../../service/product/product.service";
import {ProductCategoryService} from "../../service/product-category/product-category.service";
import {ProductTypeService} from "../../service/product-type/product-type.service";
import {IohProductCategoryModel} from "../../model/product/ioh-product-category.model";
import {IohProductTypeModel} from "../../model/product/ioh-product-type.model";
import {IohProduct} from "../../model/product/ioh-product";

@Injectable({
  providedIn: 'root'
})
export class ProductState implements OnDestroy {

  private isReadySubject = new BehaviorSubject<boolean>(false);
  public isReady$ = this.isReadySubject.asObservable();

  private listProductSubject = new BehaviorSubject<IohProduct[]>([]);
  public $listProduct = this.listProductSubject.asObservable();

  private listCategorySubject = new BehaviorSubject<IohProductCategoryModel[]>([]);
  public $listCategory = this.listCategorySubject.asObservable();

  private listProductTypeSubject = new BehaviorSubject<IohProductTypeModel[]>([]);
  public $listProductType = this.listProductTypeSubject.asObservable();

  subscription: Subscription = new Subscription();

  constructor(private productService: ProductService,
              private productCategoryService: ProductCategoryService,
              private productTypeService: ProductTypeService) {
    this.getListProduct();
    this.getListProductCategory();
    this.getListProductType();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setIsReady(isReady: boolean): void {
    this.isReadySubject.next(isReady);
  }

  getIsReady(): boolean {
    return this.isReadySubject.getValue();
  }

  getProductCategory(): IohProductCategoryModel[] {
    return this.listCategorySubject.getValue();
  }

  setProductCategory(categoryModel: IohProductCategoryModel[]): void {
    return this.listCategorySubject.next(categoryModel);
  }

  getProductType(): IohProductTypeModel[] {
    return this.listProductTypeSubject.getValue();
  }

  setProductType(productType: IohProductTypeModel[]): void {
    return this.listProductTypeSubject.next(productType);
  }

  getProduct(): IohProduct[] {
    return this.listProductSubject.getValue();
  }

  setProduct(product: IohProduct[]): void {
    return this.listProductSubject.next(product);
  }
  getListProduct(): void {
    const sb = this.productService.getProduct()
      .pipe(
        tap((listProduct: IohProduct[]) => this.setProduct(listProduct)),
        catchError(async (error) => console.log(error)),
        finalize(() => this.setIsReady(true))
      )
      .subscribe()
    this.subscription.add(sb);
  }
  getListProductCategory(): void {
    const sb = this.productCategoryService.getProductCategory()
      .pipe(
        tap((listCategory: IohProductCategoryModel[]) => this.setProductCategory(listCategory)),
        catchError(async (error) => console.log(error)),
        finalize(() => this.setIsReady(true))
      )
      .subscribe()
    this.subscription.add(sb);
  }
  getListProductType(): void {
    const sb = this.productTypeService.getProductType()
      .pipe(
        tap((listProductType: IohProductTypeModel[]) => this.setProductType(listProductType)),
        catchError(async (error) => console.log(error)),
        finalize(() => this.setIsReady(true))
      )
      .subscribe()
    this.subscription.add(sb);
  }

  createProduct(product: IohProduct): Observable<IohProduct>{
    this.setIsReady(false);
    return this.productService.createProduct(product)
      .pipe(
        finalize(() => this.setIsReady(true))
      );
  }

  createProductCategory(productCategory: IohProductCategoryModel): Observable<IohProductCategoryModel>{
    this.setIsReady(false);
    return this.productCategoryService.createProductCategory(productCategory)
      .pipe(
        finalize(() => this.setIsReady(true))
      );
  }

  createProductType(ProductType: IohProductTypeModel): Observable<IohProductTypeModel>{
    this.setIsReady(false);
    return this.productTypeService.createProductType(ProductType)
      .pipe(
        finalize(() => this.setIsReady(true))
      );
  }
}