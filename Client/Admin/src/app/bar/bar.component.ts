import { Component, Injectable, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DatabaseService } from './../services/database.service';
import { Products } from '../products';
import { nextTick } from 'process';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
})
@Injectable()
export class BarComponent implements OnInit {
  data = [];

  constructor(private dataBaseService: DatabaseService) {}

  ngOnInit(): void {
    const myObserver = {
      next: (x) => {
     
        x.data.map((val) => this.data.push(val));
      },
      error: (err) => console.error('Observer got an error: ', err),
      complete: () => console.log('Observer got a complete notification'),
    };
    this.dataBaseService.getAllProducts().subscribe(myObserver);
    console.log(this.data, 'data products');
    this.createSvg();
    //  console.log(abc, 'abc logged');

    this.drawBars(this.data);
  }

  private svg;
  private margin = 50;
  private width = 750 - this.margin * 2;
  private height = 400 - this.margin * 2;

  private fetchProducts(observer): any {
    console.log(
      this.dataBaseService.getAllProducts().subscribe(observer),
      'fetch products method'
    );
    this.dataBaseService.getAllProducts().subscribe(observer);
  }

  private createSvg(): void {
    this.svg = d3
      .select('figure#bar')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }
  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    console.log(data,"indside drawbars");
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d) => d.address))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create the Y-axis band scale
    const y = d3.scaleLinear().domain([0, 5000]).range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append('g').call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg
      .selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.address))
      .attr('y', (d) => y(d.price))
      .attr('width', x.bandwidth())
      .attr('height', (d) => this.height - y(d.price))
      .attr('fill', '#d04a35');
  }


 
}
