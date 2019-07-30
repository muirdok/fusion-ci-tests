#!/usr/bin/python
import ssl
import json
from pysphere import VIServer

import sys, getopt

def main(argv):
   try:
      opts, args = getopt.getopt(argv,"i:u:p:n:h",["iphost=","vuser=","vpass=","vmname=","help"])
   except getopt.GetoptError:
      print 'test.py -i <vhost> -u <name> -p <vpass> -n <vmname>'
      sys.exit(4)
   for opt, arg in opts:
      if opt == '-h':
         print 'test.py -i <vhost> -u <vname> -p <vpass> -n <vmname>'
         sys.exit()
      elif opt in ("-i", "--vhost"):
         iphost = arg
      elif opt in ("-u", "--vname"):
         vuser = arg
      elif opt in ("-p", "--vpass"):
         vpass = arg
      elif opt in ("-n", "--vmname"):
         vmname = arg
   ssl._create_default_https_context = ssl._create_unverified_context
   server = VIServer()
   server.connect(iphost, vuser, vpass)
   vm1 = server.get_vm_by_name(vmname)
   print vm1.get_properties().get('ip_address')


if __name__ == "__main__":
   main(sys.argv[1:])


#ssl._create_default_https_context = ssl._create_unverified_context
#
#vhost = "vcenter.hypernexenta.corp"
#vuser = "administrator@vsphere.local"
#vpass = "Nexenta1!"
#vm    = "TestVM"
#
#server = VIServer()
#server.connect(vhost, vuser, vpass)
#vm1 = server.get_vm_by_name(vm)
#
#print vm1.get_properties().get('ip_address')

#a = json.loads(vm1.get_properties())
#print a

