import { animate, group, query, state, style, transition, trigger } from "@angular/animations";

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
    transition('* => isBelow', slideTo('top') ),
    transition('* => isAbove', slideTo('top') ),
    transition('isRight => *', slideTo('left') ),
    transition('isLeft => *', slideTo('right') ),
    transition('isAbove => *', slideTo('top') ),
    transition('isBelow => *', slideTo('top') ),
  ]);

  // This function is utilised in the slider export.
function slideTo(direction: any) {
  const optional = { optional: true };
  if (direction === 'left' || direction === 'right') {
    return [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          [direction]: 0,
          width: '100%'
        })
      ], optional),
      query(':enter', [
        style({ 
          [direction]: '-100%',
      })
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
  } else if (direction === 'top') {
    return [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          [direction]: 0,
          transform: 'translateY(64px)',
          width: '100%',
          overflow: 'hidden'
        })
      ], optional),
      query(':enter', [
        style({ 
          [direction]: '-100%',
      })
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
  } else {
    // This is never hit, can't get slideTo('bottom') to work!!
    return [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          [direction]: 0,
          width: '100%',
          overflow: 'hidden'
        })
      ], optional),
      query(':enter', [
        style({ 
          [direction]: '-100%',
          overflow: 'hidden'
      })
      ]),
      group([
        query(':leave', [
          animate('1000ms ease', style({ [direction]: '100%', overflow: 'hidden'}))
        ], optional),
        query(':enter', [
          animate('1000ms ease', style({ [direction]: '0%', overflow: 'hidden',}))
        ])
      ]),
    ];
  }
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

export const uncoverPiecesFromLeft  = 
trigger('uncoverPiecesFromLeft', [
  transition(':enter', [
    style({width: '0', margin: '0'}),
    animate('500ms ease-in', style({width: '*', margin: '*'}))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({width: '0', margin: '0'}))
  ])
])

export const fadeInOut =
trigger('fadeInOut', [
  state('in', style({opacity: 1})),
  transition(':enter', [
    style({opacity: 0}),
    animate(600)
  ]),
  transition(':leave',
    animate(600, style({opacity: 0})))
])


