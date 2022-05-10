import { Component, OnInit, EventEmitter, OnDestroy, Output, Input } from '@angular/core';
import { MxIndex } from '@marxa/index';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { Subscription } from 'rxjs';
import { ArqueoModel, UpdateRecord, DeleteRecord } from '../arqueo.model';
import { ArqueosService } from '../arqueos.service';

@Component({
  selector: 'app-counting-report',
  templateUrl: './counting-report.component.html',
  styleUrls: ['./counting-report.component.scss']
})
export class CountingReportComponent implements OnInit, OnDestroy {

  @Input() arqueo!: ArqueoModel
  records: UpdateRecord[] = [];
  deletedProducts: DeleteRecord[] = [];
  private indexSubscription!: Subscription;
  @Output() close: EventEmitter<any> = new EventEmitter()

  constructor (
    private _index: MxIndex,
    public arqueos: ArqueosService,
  ) { }

  ngOnInit(): void {
    const recordsPath = `${this.arqueos.path}/${this.arqueo.id}/records`
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
