import { LightningElement, api, track } from "lwc";

const TILE_WRAPPER_SELECTED_CLASS = "tile-wrapper selected";
const TILE_WRAPPER_UNSELECTED_CLASS = "tile-wrapper";

export default class ProductTile extends LightningElement {
  @api product;
  @api selectedProductId;
  @api visibility = "";
  @track isChecked = false;

  get backgroundStyle() {
    return "background-image:url(" + this.product.Picture__c + ")";
  }

  get tileClass() {
    // eslint-disable-next-line eqeqeq
    if (this.product.Id == this.selectedProductId) {
      return TILE_WRAPPER_SELECTED_CLASS + " tile";
    }
    return TILE_WRAPPER_UNSELECTED_CLASS + " tile";
  }

  handleChange(event) {
    this.isChecked = event.target.checked;
    const check = this.isChecked;
    if (check) {
      // eslint-disable-next-line @lwc/lwc/no-api-reassignments
      this.selectedProductId = this.product.Id;
      const productselect = new CustomEvent("productselect", {
        detail: {
          productId: this.selectedProductId,
          addorRemove: "add"
        }
      });
      this.dispatchEvent(productselect);
    } else {
      // eslint-disable-next-line @lwc/lwc/no-api-reassignments
      this.selectedProductId = this.product.Id;
      const productselect = new CustomEvent("productselect", {
        detail: {
          productId: this.selectedProductId,
          addorRemove: "remove"
        }
      });
      this.dispatchEvent(productselect);
    }
  }

  selectProduct() {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.selectedProductId = this.product.Id;
    const productselect = new CustomEvent("selectedproduct", {
      detail: {
        productId: this.selectedProductId
      }
    });
    this.dispatchEvent(productselect);
  }

  get visibilityStyle() {
    return "visibility:" + this.visibility + ";";
  }
}