# Two-source Wave Interference Simulation App

A.k.a. "Makin' Waves in Cairo!"

This is the front-end of the simulation. The back-end is here: 
https://github.com/whatthedev-eth/two_source_interference


**Repeated below are the main ideas to know about the simulation:**

Simulated here is the wave interference pattern produced by two wave sources with identical wavelength `lambda`. 
- A "top-view" 2-D intensity plot is created. 
- The plot is square with side length 1000 (arbitrary units). 
- The origin is at the center of the left edge of the plot. 
- The sources are placed a distance `d` apart on the left edge of the plot, symmetrically about the origin.


## User Inputs

Only these *integer* inputs for now:
- `num_pts` = number of points along each axis of the square grid, where 2 <= `num_pts` <= 25 (max value limited by allowed n_steps on testnet)
- `lambda` >= 1
- `d` >= 0
