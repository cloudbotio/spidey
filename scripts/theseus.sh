#!/bin/bash

node-theseus app.js & 

for i in `find ../* -name \*.js`; do
    node-theseus $i > theseus.out &
done