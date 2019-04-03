import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  searchControl = new FormControl();

  constructor(private heroService: HeroService, private router: Router) {}

  nav(id): void {
    this.router.navigate([`/detail/${id}`]);
    this.searchControl.reset();
  }

  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe(term => {
      this.searchTerms.next(term);
    });

    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => {
        return this.heroService.searchHeroes(term);
      })
    );
  }
}
