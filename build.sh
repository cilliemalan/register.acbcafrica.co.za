#!/bin/bash

yarn

NODE_ENV=production yarn build

cd .. && tar -zcvf ~/register.acbcafrica.co.za.tar.gz register.acbcafrica.co.za/

scp ~/register.acbcafrica.co.za.tar.gz ubuntu@mx.chills.co.za:~/

ssh ubuntu@mx.chills.co.za 'cd ~ && tar -xvf register.acbcafrica.co.za.tar.gz'