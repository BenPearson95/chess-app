import { animate, group, query, style, transition, trigger } from "@angular/animations";

// Top right welcome text when logged in.
export const welcomeAnimation =
  trigger('welcomeAnimation', [
    transition(':enter', [
      style({transform: 'translateX(100%)', opacity: 0}),
      animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
    ]),
    transition(':leave', [
      style({transform: 'translateX(0)', opacity: 1}),
      animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
    ])
  ]);

// The page slide animation.
export const slider =
  trigger('routeAnimations', [
    transition('* => isLeft', slideTo('left') ),
    transition('* => isRight', slideTo('right') ),
    transition('isRight => *', slideTo('left') ),
    transition('isLeft => *', slideTo('right') )
  ]);

  // This function is utilised in the slider export.
function slideTo(direction: any) {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 76,
        [direction]: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ [direction]: '-100%'})
    ]),
    group([
      query(':leave', [
        animate('1000ms ease', style({ [direction]: '100%'}))
      ], optional),
      query(':enter', [
        animate('1000ms ease', style({ [direction]: '0%'}))
      ])
    ]),
  ];
}

// group of generic slide in animations.
export const slideFromBottom = 
trigger('slideFromBottom', [
  transition(':enter', [
    style({transform: 'translateY(100%)'}),
    animate('500ms ease-in', style({transform: 'translateY(0%)'}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'translateY(100%)'}))
  ])
]);

export const slideFromTop = 
trigger('slideFromTop', [
  transition(':enter', [
    style({transform: 'translateY(-100%)'}),
    animate('500ms ease-in', style({transform: 'translateY(0%)'}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'translateY(-100%)'}))
  ])
])

export const slideFromRight = 
trigger('slideFromRight', [
  transition(':enter', [
    style({transform: 'translateX(100%)'}),
    animate('500ms ease-in', style({transform: 'translateX(0%)'}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'translateX(100%)'}))
  ])
])

export const slideFromLeft  = 
trigger('slideFromLeft', [
  transition(':enter', [
    style({transform: 'translateX(-100%)'}),
    animate('500ms ease-in', style({transform: 'translateX(0%)'}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({transform: 'translateX(-100%)'}))
  ])
])



