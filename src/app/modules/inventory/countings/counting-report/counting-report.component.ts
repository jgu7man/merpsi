import { Component, OnInit, EventEmitter, OnDestroy, Output, Input } from '@angular/core';
import { MxIndex } from '@marxa/index';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { Subscription } from 'rxjs';
import { ProductCountingModel, UpdateRecord, DeleteRecord } from '../product-counting.model';
import { CountingsService } from '../countings.service';

@Component({
  selector: 'app-counting-report',
  templateUrl: './counting-report.component.html',
  styleUrls: ['./counting-report.component.scss']
})
export class CountingReportComponent implements OnInit, OnDestroy {

  @Input() countingReport!: ProductCountingModel
  records: UpdateRecord[] = [];
  deletedProducts: DeleteRecord[] = [];
  private indexSubscription!: Subscription;
  @Output() close: EventEmitter<any> = new EventEmitter()

  constructor (
    private _index: MxIndex,
    public countings: CountingsService,
  ) { }

  ngOnInit(): void {
    const recordsPath = `${this.countings.path}/${this.countingReport.id}/records`
    this._index.initIndex( recordsPath, 'productId', 20 );
    this.indexSubscription =
    this._index.queryData.subscribe( data => {
      this.records = data
    })
  }

  ngOnDestroy() {
    this.indexSubscription.unsubscribe()
  }
}
