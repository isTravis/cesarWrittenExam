import networkx as nx

def printNodes(nodes): #Print the nodes in alphabetical order
	for key, value in sorted(nodes.items()): 
	    print key +': '+ str(value)

G = nx.Graph() 
print 'Graph Created'

G.add_nodes_from("abcdevwxyz")
print str(G.number_of_nodes())+' Nodes Created'

G.add_edge('a','b')
G.add_edge('a','c')
G.add_edge('a','e')
G.add_edge('b','c')
G.add_edge('b','d')
G.add_edge('c','d')
G.add_edge('c','e')
G.add_edge('d','e')
G.add_edge('d','v')
G.add_edge('d','z')
G.add_edge('v','w')
G.add_edge('v','x')
G.add_edge('v','z')
G.add_edge('w','x')
G.add_edge('w','y')
G.add_edge('x','y')
G.add_edge('x','z')
G.add_edge('y','z')
print str(G.number_of_edges())+' Edges Created'

print "Normalized Degree Centrality"
print "--------------"
printNodes( nx.degree_centrality(G) )
print ""

print "Normalized Closeness Centrality"
print "--------------"
printNodes( nx.closeness_centrality(G) )
print ""

print "Normalized Betweenness Centrality"
print "--------------"
printNodes( nx.betweenness_centrality(G) )
print ""

print "Eigenvector Centrality"
print "--------------"
printNodes( nx.eigenvector_centrality(G) )
print ""

